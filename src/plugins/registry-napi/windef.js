var types = require('./types'),
    struct = require('ref-struct-napi'),
    uniontype = require('ref-union-napi');

// yes, this is the name in the official MSDN doc
var DUMMYUNIONNAME = uniontype({
    hIcon: types.HANDLE,
    hMonitor: types.HANDLE
});

// https://msdn.microsoft.com/en-us/library/windows/desktop/ms724878(v=vs.85).aspx
module.exports = {
    KEY_ACCESS: {
        KEY_ALL_ACCESS: 0xF003F,
        KEY_CREATE_LINK: 0x0020,
        KEY_CREATE_SUB_KEY: 0x0004,
        KEY_ENUMERATE_SUB_KEYS: 0x0008,
        KEY_EXECUTE: 0x20019,
        KEY_NOTIFY: 0x0010,
        KEY_QUERY_VALUE: 0x0001,
        KEY_READ: 0x20019,
        KEY_SET_VALUE: 0x0002,
        KEY_WOW64_32KEY: 0x0200,
        KEY_WOW64_64KEY: 0x0100,
        KEY_WRITE: 0x20006
    },
    HKEY: {
        HKEY_CLASSES_ROOT: 0x80000000,
        HKEY_CURRENT_USER: 0x80000001,
        HKEY_LOCAL_MACHINE: 0x80000002,
        HKEY_USERS: 0x80000003,
        HKEY_PERFORMANCE_DATA: 0x80000004,
        HKEY_CURRENT_CONFIG: 0x80000005,
        HKEY_DYN_DATA: 0X80000006
    },
    REG_VALUE_TYPE: {
        REG_NONE:0,
        REG_SZ: 1,
        REG_EXPAND_SZ: 2,
        REG_BINARY: 3,
        REG_DWORD: 4,
        REG_DWORD_BIG_ENDIAN: 5,
        REG_DWORD_LITTLE_ENDIAN: 4,
        REG_LINK: 6,
        REG_MULTI_SZ: 7,
        REG_RESOURCE_LIST: 8
    },
    REG_OPTION_NON_VOLATILE: 0,
    /*
    typedef struct _SHELLEXECUTEINFO {
    DWORD     cbSize;
    ULONG     fMask;
    HWND      hwnd;
    LPCTSTR   lpVerb;
    LPCTSTR   lpFile;
    LPCTSTR   lpParameters;
    LPCTSTR   lpDirectory;
    int       nShow;
    HINSTANCE hInstApp;
    LPVOID    lpIDList;
    LPCTSTR   lpClass;
    HKEY      hkeyClass;
    DWORD     dwHotKey;
    union {
        HANDLE hIcon;
        HANDLE hMonitor;
    } DUMMYUNIONNAME;
    HANDLE    hProcess;
    } SHELLEXECUTEINFO, *LPSHELLEXECUTEINFO;
    */
    SHELLEXECUTEINFO: struct({
        cbSize: types.DWORD,
        fMask: types.ULONG,
        hwnd: types.HWND,
        lpVerb:  types.STRING,
        lpFile:  types.STRING,
        lpParameters: types.STRING,
        lpDirectory: types.STRING,
        nShow: types.INT,
        hInstApp: types.HINSTANCE,
        lpIDList: types.LPVOID,
        lpClass: types.STRING,
        hkeyClass: types.HKEY,
        dwHotKey: types.DWORD,
        DUMMYUNIONNAME: DUMMYUNIONNAME,
        hProcess: types.HANDLE
    })
};
