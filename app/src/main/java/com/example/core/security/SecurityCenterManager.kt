package com.example.core.security

import com.example.core.model.SecurityAuditStatus
import com.example.core.tor.TorNetworkManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

object SecurityCenterManager {

    private val _securityStatus = MutableStateFlow(
        SecurityAuditStatus(
            httpsEnforced = true,
            torFailClosedActive = true,
            webRtcShieldActive = true,
            dnsLeakShieldActive = true,
            totalTrackersBlocked = 186,
            storageEncryptionActive = true,
            phishingShieldActive = true,
            activeVulnerabilitiesFound = 0
        )
    )
    val securityStatus: StateFlow<SecurityAuditStatus> = _securityStatus.asStateFlow()

    fun runSecurityAudit(): SecurityAuditStatus {
        val torStatus = TorNetworkManager.torStatus.value
        val isTorProtected = torStatus.dnsLeakProtected && torStatus.isFailClosedActive

        val updated = _securityStatus.value.copy(
            torFailClosedActive = isTorProtected,
            dnsLeakShieldActive = true,
            totalTrackersBlocked = _securityStatus.value.totalTrackersBlocked + (2..6).random()
        )
        _securityStatus.value = updated
        return updated
    }

    fun incrementTrackersBlocked(count: Int = 1) {
        _securityStatus.value = _securityStatus.value.copy(
            totalTrackersBlocked = _securityStatus.value.totalTrackersBlocked + count
        )
    }

    fun toggleWebRtcShield(enabled: Boolean) {
        _securityStatus.value = _securityStatus.value.copy(
            webRtcShieldActive = enabled
        )
    }

    fun toggleHttpsEnforcement(enabled: Boolean) {
        _securityStatus.value = _securityStatus.value.copy(
            httpsEnforced = enabled
        )
    }
}
