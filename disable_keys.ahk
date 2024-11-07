; Disable Alt+Tab
!Tab::Return

; Disable Ctrl+Shift+Esc
^+Esc::Return

; Disable Windows key
LWin::Return
RWin::Return

; Disable Alt+F4
!F4::Return

; Disable Print Screen (by scan code)
SC137::Return

; Optionally, use a persistent loop to disable Print Screen continuously
SetTimer, DisablePrintScreen, 100  ; Check every 100ms
return

DisablePrintScreen:
    if (GetKeyState("PrintScreen", "P")) {
        Send, {Blind}{PrintScreen Up}  ; Release Print Screen if it’s pressed
    }
return
