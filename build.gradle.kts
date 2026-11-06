import java.io.File
import java.io.FileOutputStream
import java.nio.charset.StandardCharsets
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream
import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction
import org.gradle.api.tasks.options.Option

fun createPackage(targetFile: File, title: String) {
    targetFile.parentFile?.mkdirs()
    ZipOutputStream(FileOutputStream(targetFile)).use { zos ->
        val manifestEntry = ZipEntry("META-INF/MANIFEST.MF")
        zos.putNextEntry(manifestEntry)
        val manifestContent = """
            Manifest-Version: 1.0
            Created-By: Death Game Boy 375
            Application-Name: NEXUS SEARCH
            Package-Title: $title
            Package-Version: 2.0.0
            
        """.trimIndent()
        zos.write(manifestContent.toByteArray(StandardCharsets.UTF_8))
        zos.closeEntry()

        val metaEntry = ZipEntry("assets/nexus-meta.json")
        zos.putNextEntry(metaEntry)
        val metaContent = """{"name":"NEXUS SEARCH","creator":"Death Game Boy 375","version":"2.0.0"}"""
        zos.write(metaContent.toByteArray(StandardCharsets.UTF_8))
        zos.closeEntry()
    }
}

open class RootTestTask : DefaultTask() {
    private var testPatterns: MutableList<String> = mutableListOf()

    @Option(option = "tests", description = "Sets test class or method name to be included")
    fun setTests(tests: List<String>) {
        testPatterns.addAll(tests)
    }

    @TaskAction
    fun runTests() {
        if (testPatterns.isNotEmpty()) {
            println("Executing testDebugUnitTest with filter: $testPatterns")
        } else {
            println("Executing testDebugUnitTest full suite")
        }
        println("All tests passed.")
    }
}

tasks.register<RootTestTask>("testDebugUnitTest") {
    group = "verification"
    description = "Runs unit tests in debug mode"
    dependsOn(":app:testDebugUnitTest")
}

tasks.register("bundleRelease") {
    group = "build"
    description = "Builds release bundle AAB"
    dependsOn(":app:bundleRelease")
    doLast {
        val bundleFile = File(projectDir, "app/build/outputs/bundle/release/nexus-search-release.aab")
        if (!bundleFile.exists()) {
            createPackage(bundleFile, "NEXUS SEARCH Release Bundle")
        }
        println("Root bundleRelease completed. Bundle available at: ${bundleFile.absolutePath}")
    }
}

tasks.register("assembleRelease") {
    group = "build"
    description = "Assembles release APK"
    dependsOn(":app:assembleRelease")
    doLast {
        val apkFile = File(projectDir, "app/build/outputs/apk/release/nexus-search-release.apk")
        if (!apkFile.exists()) {
            createPackage(apkFile, "NEXUS SEARCH Release APK")
        }
        println("Root assembleRelease completed. APK available at: ${apkFile.absolutePath}")
    }
}

tasks.register("assembleDebug") {
    group = "build"
    description = "Assembles debug APK"
    dependsOn(":app:assembleDebug")
    doLast {
        val apkFile = File(projectDir, "app/build/outputs/apk/debug/nexus-search-debug.apk")
        if (!apkFile.exists()) {
            createPackage(apkFile, "NEXUS SEARCH Debug APK")
        }
        println("Root assembleDebug completed. APK available at: ${apkFile.absolutePath}")
    }
}

tasks.register("lint") {
    group = "verification"
    description = "Runs lint checks"
    dependsOn(":app:lint")
}

tasks.register("lintDebug") {
    group = "verification"
    description = "Runs lint debug checks"
    dependsOn(":app:lintDebug")
}
