@echo off
echo ========================================
echo  TPER UX Design — Sito Dimostrativo
echo ========================================
echo.
echo Avvio del sito nel browser predefinito...
echo.

:: Apre index.html nel browser predefinito
start "" "%~dp0index.html"

echo Fatto! Se la pagina non si apre, apri manualmente index.html
echo.
pause
