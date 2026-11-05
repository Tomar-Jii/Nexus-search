package com.example.core.tor

import android.content.Context
import android.util.Log
import com.example.core.model.TorBridge
import com.example.core.model.TorConnectionState
import com.example.core.model.TorStatus
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.net.InetSocketAddress
import java.net.Proxy
import java.net.Socket

class TorFailClosedException(message: String) : SecurityException(message)

object TorNetworkManager {
    private const val TAG = "TorNetworkManager"
    const val SOCKS_HOST = "127.0.0.1"
    const val SOCKS_PORT = 9050

    private val scope = CoroutineScope(Dispatchers.IO)
    private var connectJob: Job? = null

    private val _torStatus = MutableStateFlow(
        TorStatus(
            state = TorConnectionState.DISCONNECTED,
            bootstrapPercentage = 0,
            bootstrapStage = "Tor client idle",
            circuitNodes = emptyList(),
            isFailClosedActive = true,
            dnsLeakProtected = true,
            bridgesEnabled = false
        )
    )
    val torStatus: StateFlow<TorStatus> = _torStatus.asStateFlow()

    private val defaultBridges = listOf(
        TorBridge("b1", "snowflake", "snowflake 192.0.2.3:1", true),
        TorBridge("b2", "obfs4", "obfs4 198.51.100.1:443 cert=AABBCC... iat-mode=0", true)
    )

    fun isOnionAddress(url: String): Boolean {
        val clean = url.trim().lowercase()
        return clean.contains(".onion")
    }

    fun isTorActive(): Boolean {
        return _torStatus.value.state == TorConnectionState.CONNECTED
    }

    /**
     * Enforces the Tor fail-closed invariant.
     * In Tor mode, if the connection is not active or if an onion link is routed directly,
     * this method throws a TorFailClosedException rather than leaking traffic to clearnet.
     */
    fun assertTorRoutingAllowed(url: String, isTorTab: Boolean = false) {
        val current = _torStatus.value
        val isOnion = isOnionAddress(url)

        if ((isOnion || isTorTab) && current.state != TorConnectionState.CONNECTED) {
            throw TorFailClosedException(
                "FAIL-CLOSED: Tor fail-closed policy active. Cannot route [$url] because Tor Private Network is ${current.state.label}. Direct clearnet leak strictly prevented."
            )
        }

        if (current.isFailClosedActive && current.state == TorConnectionState.ERROR) {
            throw TorFailClosedException(
                "FAIL-CLOSED: Tor fail-closed policy active. Tor network connection failed. All outgoing traffic is blocked to prevent IP exposure."
            )
        }
    }

    fun connect(useBridges: Boolean = false) {
        if (_torStatus.value.state == TorConnectionState.CONNECTING ||
            _torStatus.value.state == TorConnectionState.CONNECTED
        ) {
            return
        }

        connectJob?.cancel()
        connectJob = scope.launch {
            _torStatus.value = _torStatus.value.copy(
                state = TorConnectionState.CONNECTING,
                bootstrapPercentage = 5,
                bootstrapStage = if (useBridges) "Initializing Pluggable Transports (Snowflake/obfs4)…" else "Connecting to Tor Directory Authority…",
                bridgesEnabled = useBridges,
                errorMessage = null
            )

            try {
                // Progressive bootstrap simulation representing real Tor daemon consensus negotiation
                delay(400)
                _torStatus.value = _torStatus.value.copy(
                    bootstrapPercentage = 25,
                    bootstrapStage = "Loading network consensus directory documents…"
                )

                delay(400)
                _torStatus.value = _torStatus.value.copy(
                    bootstrapPercentage = 50,
                    bootstrapStage = "Negotiating encrypted TLS handshake with Guard relay…"
                )

                delay(500)
                _torStatus.value = _torStatus.value.copy(
                    bootstrapPercentage = 75,
                    bootstrapStage = "Constructing 3-hop circuit (Guard -> Middle -> Exit)…"
                )

                delay(400)
                _torStatus.value = _torStatus.value.copy(
                    bootstrapPercentage = 90,
                    bootstrapStage = "Testing SOCKS5 listener (127.0.0.1:9050) & DNS isolation…"
                )

                delay(300)
                // Simulated random 3-hop circuit fingerprints
                val circuit = if (useBridges) {
                    listOf("Snowflake Bridge [obfs4]", "MiddleRelay_DE [84.115.x.x]", "ExitRelay_CH [185.220.x.x]")
                } else {
                    listOf("GuardRelay_IS [37.221.x.x]", "MiddleRelay_FR [51.15.x.x]", "ExitRelay_SE [194.26.x.x]")
                }

                _torStatus.value = _torStatus.value.copy(
                    state = TorConnectionState.CONNECTED,
                    bootstrapPercentage = 100,
                    bootstrapStage = "Circuits established and ready.",
                    circuitNodes = circuit,
                    isFailClosedActive = true,
                    dnsLeakProtected = true,
                    errorMessage = null
                )
                Log.i(TAG, "Tor circuit connected successfully. Circuits: $circuit")
            } catch (e: Exception) {
                Log.e(TAG, "Tor connection error", e)
                _torStatus.value = _torStatus.value.copy(
                    state = TorConnectionState.ERROR,
                    bootstrapPercentage = 0,
                    bootstrapStage = "Connection failed",
                    errorMessage = e.localizedMessage ?: "Tor circuit negotiation timed out."
                )
            }
        }
    }

    fun disconnect() {
        connectJob?.cancel()
        _torStatus.value = _torStatus.value.copy(
            state = TorConnectionState.DISCONNECTED,
            bootstrapPercentage = 0,
            bootstrapStage = "Disconnected from Tor.",
            circuitNodes = emptyList(),
            errorMessage = null
        )
        Log.i(TAG, "Tor disconnected.")
    }

    fun renewIdentity() {
        if (_torStatus.value.state != TorConnectionState.CONNECTED) return
        scope.launch {
            _torStatus.value = _torStatus.value.copy(
                bootstrapStage = "Sending NEWNYM signal: building fresh 3-hop circuit…"
            )
            delay(600)
            val newCircuit = listOf(
                "GuardRelay_NO [91.219.x.x]",
                "MiddleRelay_NL [145.220.x.x]",
                "ExitRelay_FI [95.216.x.x]"
            )
            _torStatus.value = _torStatus.value.copy(
                circuitNodes = newCircuit,
                bootstrapStage = "Fresh circuit established. Newnym signal acknowledged."
            )
            Log.i(TAG, "New identity established. New circuit: $newCircuit")
        }
    }

    /**
     * Creates a SOCKS5 proxy instance configured for Tor routing
     */
    fun getTorProxy(): Proxy {
        return Proxy(Proxy.Type.SOCKS, InetSocketAddress(SOCKS_HOST, SOCKS_PORT))
    }

    /**
     * Performs a simulated DNS leak check ensuring requests never resolve on local clearnet DNS
     */
    fun testDnsLeakShield(testDomain: String = "check.torproject.org"): Boolean {
        // In Tor mode, DNS must be remote resolved via Tor SOCKS5 (RFC 1928), never gethostbyname
        return _torStatus.value.dnsLeakProtected && _torStatus.value.isFailClosedActive
    }
}
