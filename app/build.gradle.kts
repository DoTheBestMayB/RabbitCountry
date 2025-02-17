plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.jetbrains.compose)
    alias(libs.plugins.compose.compiler)
}

group = "com.dothebestmayb.rabbitcountry"
version = "2.0.0"

kotlin {
    js(IR) {
        binaries.executable()
        browser {
            webpackTask {
                // Force the final output name
                mainOutputFileName = "background.js"
            }
            // Put the compiled JS in a shared folder so it's easy to copy later
            distribution {
                outputDirectory = File("$rootDir/build/distributions")
            }
        }
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(project(":background"))
                implementation(project(":content"))
                implementation(project(":popup"))
            }
        }
    }
}

tasks {
    // Copy js scripts
    val background = ":background:jsBrowserProductionWebpack"
    val content = ":content:jsBrowserProductionWebpack"
    val popup = ":popup:jsBrowserProductionWebpack"
    val extensionFolder = "$projectDir/build/extension"
    val copyBundleFile = register<Copy>("copyBundleFile") {
        dependsOn(background, content, popup)
        from(
            "$projectDir/../build/distributions/background.js",
            "$projectDir/../build/distributions/content.js",
            "$projectDir/../build/distributions/popup.js",
        )
        into(extensionFolder)
    }

    // Copy resources
    val copyResources = register<Copy>("copyResources") {
        val resourceFolder = "src/main/resources"
        from(
            "$resourceFolder/manifest.json",
            "$resourceFolder/icons",
            "$resourceFolder/html",
            "$resourceFolder/css"
        )
        into(extensionFolder)
    }

    // Build modules
    val buildExtension = register("buildExtension") {
        dependsOn(copyBundleFile, copyResources)
    }

    // Zip extension
    val packageExtension = register<Zip>("packageExtension") {
        dependsOn(buildExtension)
        from(extensionFolder)
    }
}
