plugins {
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.jetbrains.compose)
}

kotlin {
    js(IR) {
        binaries.executable()
        browser {
            distribution {
                outputDirectory = File("$rootDir/build/distributions/")
            }
        }
    }
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(libs.kotlin.stdlib.js)
                implementation(project(":chrome"))
                implementation(project(":data"))
                implementation(libs.compose.html.core)
                implementation(libs.compose.runtime)
                implementation(libs.kotlinx.serialization.json)
            }
        }
    }
}
