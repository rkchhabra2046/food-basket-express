@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@echo off
setlocal enabledelayedexpansion

set MAVEN_PROJECTBASEDIR=%~dp0
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

set JVM_CONFIG_FILE="%MAVEN_PROJECTBASEDIR%\.mvn\jvm.config"
if exist %JVM_CONFIG_FILE% (
    for /F "usebackq delims=" %%a in (%JVM_CONFIG_FILE%) do set JVM_CONFIG_MAVEN_PROPERTIES=!JVM_CONFIG_MAVEN_PROPERTIES! %%a
)

set MAVEN_CONFIG_FILE="%MAVEN_PROJECTBASEDIR%\.mvn\maven.config"
if exist %MAVEN_CONFIG_FILE% (
    for /F "usebackq delims=" %%a in (%MAVEN_CONFIG_FILE%) do set MAVEN_CONFIG_MAVEN_PROPERTIES=!MAVEN_CONFIG_MAVEN_PROPERTIES! %%a
)

set JAVA_EXE=java
if defined JAVA_HOME (
    if exist "%JAVA_HOME%\bin\java.exe" (
        set JAVA_EXE="%JAVA_HOME%\bin\java.exe"
    )
)

%JAVA_EXE% %JVM_CONFIG_MAVEN_PROPERTIES% -classpath %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %MAVEN_CONFIG_MAVEN_PROPERTIES% %*
if ERRORLEVEL 1 goto error
goto end

:error
exit /b 1

:end
exit /b 0
