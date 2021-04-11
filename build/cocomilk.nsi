;
; 椰奶：椰羊的自动更新程序
;
; --app=单文件路径
; --url=更新包地址
; --patch=true 增量更新
;
; @YuehaiTeam-xyToki 2021.04.11
;
!include LogicLib.nsh
!include nsDialogs.nsh
!include nsWindows.nsh
!include FileFunc.nsh
!include StrFunc.nsh
${StrStr}
!define /math PBM_SETRANGE32 ${WM_USER} + 6

!define PRODUCT_NAME "椰奶"
!define PRODUCT_VERSION "0.0.0.1"

!packhdr "exehead.tmp" '"${NSISDIR}\upx.exe" -9 "exehead.tmp"'

LoadLanguageFile "${NSISDIR}\Contrib\Language files\SimpChinese.nlf"
VIProductVersion "${PRODUCT_VERSION}"
VIAddVersionKey /LANG=${LANG_SIMPCHINESE} "ProductName" "${PRODUCT_NAME}"
VIAddVersionKey /LANG=${LANG_SIMPCHINESE} "Comments" "椰羊cocogoat: 等级突破"
VIAddVersionKey /LANG=${LANG_SIMPCHINESE} "CompanyName" "月海亭YuehaiTeam"
VIAddVersionKey /LANG=${LANG_SIMPCHINESE} "LegalCopyright" "Copyright 2021 月海亭YuehaiTeam"
VIAddVersionKey /LANG=${LANG_SIMPCHINESE} "FileDescription" "椰羊cocogoat: 等级突破"
VIAddVersionKey /LANG=${LANG_SIMPCHINESE} "FileVersion" "${PRODUCT_VERSION}"
VIAddVersionKey /LANG=${LANG_SIMPCHINESE} "ProductVersion" "${PRODUCT_VERSION}"


Icon "cocogoat.ico"
OutFile "cocomilk.exe"
Name "${PRODUCT_NAME}"
caption "${PRODUCT_NAME}"
InstallDir "$TEMP\cocogoat\ascension"


XPStyle on
SetCompress force
SetCompressor /FINAL /SOLID lzma

Page Custom downloadPage

Section -Post
SectionEnd

Var hInfo
Var /GLOBAL hPBar

Var lastFinished
Var speedDiff
Var speedDiffMiddle
Var percentage
Var percentageMiddle
Var percentagePoint

Var /GLOBAL appFile
Var /GLOBAL usePatch

Function downloadTimer
	InetBgDL::GetStats
	${If} $2 = 0
	    SendMessage $hPBar ${PBM_SETRANGE32} 0 9999
	    SendMessage $hPBar ${PBM_SETPOS} 9998 0
	    ${NSD_KillTimer} downloadTimer
	    ${NSD_SetText} $hInfo "下载完成"
			${If} $usePatch == "true"
	    		${NSD_SetText} $hInfo "增量更新处理中..."
	    		nsExec::Exec '$INSTDIR\hpatchz.exe "$appFile" "$INSTDIR\cocogoat_new.exe" "$INSTDIR\cocogoat_patched.exe"'
	    		${NSD_SetText} $hInfo "替换更新中..."
					CopyFiles "$INSTDIR\cocogoat_patched.exe" $appFile
					Delete "$INSTDIR\cocogoat_patched.exe"
			${Else}
	    		${NSD_SetText} $hInfo "替换更新中..."
					CopyFiles "$INSTDIR\cocogoat_new.exe" $appFile
			${EndIf}
			Delete "$INSTDIR\cocogoat_new.exe"
			Delete "$INSTDIR\hpatchz.exe"
			Exec '"$appFile"'
			sleep 600
			Call LeaveInstaller
			Return
	${EndIf}

	; 速度计算
	IntOp $speedDiffMiddle $3 - $lastFinished
	IntOp $speedDiff $speedDiffMiddle / 1000
	IntOp $speedDiff $speedDiff * 2
	IntOp $lastFinished $3 + 0

	; 已下载大小计算
	IntOp $percentageMiddle $4 / 1000
	IntOp $percentageMiddle $3 / $percentageMiddle
	IntOp $percentage $percentageMiddle / 10
	StrCpy $percentagePoint $percentageMiddle "" -1

	; 信息显示
	${If} $usePatch == "true"
			${NSD_SetText} $hInfo "下载增量更新包 $percentage.$percentagePoint% ( $speedDiff kb/s )"
	${Else}
			${NSD_SetText} $hInfo "下载更新包 $percentage.$percentagePoint% ( $speedDiff kb/s )"
	${EndIf}
	SendMessage $hPBar ${PBM_SETRANGE32} 0 $4
	SendMessage $hPBar ${PBM_SETPOS} $3 0
FunctionEnd

Function downloadPage
	; 命令行参数存在判断
  push $R0
  push $R1
  push $R2

	; 命令行参数解析

	Push "app"
  Push "false"
  Call GetCmdOpt
  Pop $appFile

  ${If} $appFile == "false"
		MessageBox MB_OK "参数错误: app" IDOK +1
		quit
  ${EndIf}
  
	Push "url"
  Push "false"
  Call GetCmdOpt
  Pop $R1

  ${If} $R1 == "false"
		MessageBox MB_OK "参数错误: url" IDOK +1
		quit
  ${EndIf}

	Push "patch"
  Push "false"
  Call GetCmdOpt
  Pop $usePatch

	; 窗体
	nsDialogs::Create 1018
	Pop $0
	${NSD_CreateLabel} 0 0 100% 50% "准备下载更新..."
	Pop $hInfo
	${NSD_CreateProgressBar} 0 10% 100% 16u ""
	Pop $hPBar
	SendMessage $hPBar ${PBM_SETRANGE32} 0 9999
	SendMessage $hPBar ${PBM_SETPOS} 10 0

	; 定时器
	${NSD_CreateTimer} downloadTimer 500

	; 开始下载
	SetOutPath $INSTDIR
	File hpatchz.exe
	InetBgDL::Get /RESET $R1 "$INSTDIR\cocogoat_new.exe"  /END
	nsDialogs::show
	${NSD_KillTimer} downloadTimer
FunctionEnd

Function LeaveInstaller
  Pop $0
  SendMessage $HWNDPARENT ${WM_CLOSE} "0" "0"
FunctionEnd

Function .onGUIInit
  ${NSW_SetWindowSize} $HWNDPARENT 430 95
FunctionEnd


# get command line options, modified from https://nsis.sourceforge.io/Get_command_line_parameter_by_name
Function GetCmdOpt
  Exch $R0  ; get the top of the stack(default parameter) into R0
  Exch      ; exchange the top of the stack(default) with
            ; the second in the stack(parameter to search for)
  Exch $R1  ; get the top of the stack(search parameter) into $R1

  ;Preserve on the stack the registers used in this function
  Push $R2
  Push $R3
  Push $R4
  Push $R5

  Strlen $R2 $R1+++    ; store the length of the search string into R2
	${Getparameters} $R3
  # search for quoted search string
  StrCpy $R5 '"'      ; later on we want to search for a open quote
  ;Push $R3            ; push the 'search in' string onto the stack
  ;Push '"--$R1='       ; push the 'search for'
  ${StrStr} $R4 $R3 '"--$R1='
  ;Call StrStr         ; search for the quoted parameter value
  ;Pop $R4
  StrCpy $R4 $R4 "" 1   ; skip over open quote character, "" means no maxlen
  StrCmp $R4 "" "" next ; if we didn't find an empty string go to next
  
  # search for non-quoted search string
  StrCpy $R5 ' '      ; later on we want to search for a space since we
                      ; didn't start with an open quote '"' we shouldn't
                      ; look for a close quote '"'
  ${StrStr} $R4 $R3 "--$R1="

  ; $R4 now contains the parameter string starting at the search string,
  ; if it was found
next:
  StrCmp $R4 "" check_for_switch ; if we didn't find anything then look for
                                 ; usage as a command line switch
  # copy the value after /$R1= by using StrCpy with an offset of $R2,
  # the length of '/OUTPUT='
  StrCpy $R0 $R4 "" $R2  ; copy commandline text beyond parameter into $R0
  # search for the next parameter so we can trim this extra text off
  ;Push $R0
  ;Push $R5            ; search for either the first space ' ', or the first
                      ; quote '"'
                      ; if we found '"/output' then we want to find the
                      ; ending ", as in '"/output=somevalue"'
                      ; if we found '/output' then we want to find the first
                      ; space after '/output=somevalue'
  ;Call StrStr         ; search for the next parameter
  ${StrStr} $R4 $R0 $R5
  ;Pop $R4
  StrCmp $R4 "" done  ; if 'somevalue' is missing, we are done
  StrLen $R4 $R4      ; get the length of 'somevalue' so we can copy this
                      ; text into our output buffer
  StrCpy $R0 $R0 -$R4 ; using the length of the string beyond the value,
                      ; copy only the value into $R0
  goto done           ; if we are in the parameter retrieval path skip over
                      ; the check for a command line switch
; See if the parameter was specified as a command line switch, like '/output'
	check_for_switch:
	  ;Push $R3            ; push the command line back on the stack for searching
	  ;Push '/$R1'         ; search for the non-quoted search string
	  ;Call StrStr
    ${StrStr} $R4 $R3 '--$R1'
	  ;Pop $R4
	  StrCmp $R4 "" done  ; if we didn't find anything then use the default
	  StrCpy $R0 ""       ; otherwise copy in an empty string since we found the
	                      ; parameter, just didn't find a value

	done:
	  Pop $R5
	  Pop $R4
	  Pop $R3
	  Pop $R2
	  Pop $R1
	  Exch $R0 ; put the value in $R0 at the top of the stack
FunctionEnd
