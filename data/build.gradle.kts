plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.jetbrains.compose)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.kotlin.plugin.serialization)
}

kotlin {
    js(IR) {
        binaries.executable()
        browser {}
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(libs.kotlinx.serialization.json)

                implementation(libs.compose.runtime)
            }
        }
        val jsMain by getting {
            dependencies {
                implementation(libs.kotlin.stdlib.js)
            }
        }
    }
}
