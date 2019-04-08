var useLevel = 0;

function window.onload() {
    //useLevel = GetCookie("Level");
    ReadMap(useLevel);
    document.body.scroll = 'no';

    function document.onkeydown() {
        switch (event.keyCode) {
        case 37:
            Dir(-1, 0, 'l');
            break; //left
        case 38:
            Dir(0, -1, 'u');
            break; //up
        case 39:
            Dir(1, 0, 'r');
            break; //right
        case 40:
            Dir(0, 1, 'd');
            break; //down
        }
        event.returnValue = false;
        Info.value = BackRecord.join("");
        iSelects(Count);
    }

    function document.oncontextmenu() {
        event.returnValue = false;
    }

    window.focus();
    Base.focus();
}



function ReadMap(level) {
    init();
    Base.innerHTML = '';
    var w = Map[level][0].length * MapW
    var h = Map[level].length * MapW
    Base.style.width = w;
    Base.style.height = h;
    Base.style.left = (w > document.body.clientWidth) ? 0 : (document.body.offsetWidth - w) / 2;
    //Base.style.top = 10;
    for (var y = 0; y < Map[level].length; y++) {
        MainMap[y] = [];
        for (var x = 0; x < Map[level][y].length; x++) {
            MainMap[y][x] = Map[level][y].charAt(x);
            if (MainMap[y][x] == 'W') iHtml(x, y, 'Wall');
            else {
                iHtml(x, y, 'Ground');
                switch (MainMap[y][x]) {
                case '0':
                    iBox(x, y, 0);
                    break;
                case '.':
                    iHtml(x, y, 'Aim');
                    break;
                case '@':
                    iHtml(x, y, 'Aim');
                    iBox(x, y, 1);
                    BoxCompletes++;
                    break;
                case '*':
                    iMan(x, y, 0);
                    break;
                case '#':
                    iHtml(x, y, 'Aim');
                    iMan(x, y, 1);
                    break;
                }
            }
        }
    }
}

function iHtml(x, y, k) {
    Base.insertAdjacentHTML("beforeEnd", "<span style='position:absolute;left:" + x * MapW + ";top:" + y * MapH + ";width:" + MapW + ";height:" + MapH + "' class='" + k + "' x=" + x + " y=" + y + ">");
}



function iBox(x, y, k) {
    MainMap[y][x] = Base.appendChild(document.createElement("<span style='position:absolute;left:" + x * MapW + ";top:" + y * MapH + ";width:" + MapW + ";height:" + MapH + "' class='Box' complete='" + k + "'>"));
    TotalBox++;
}

function iMan(x, y, k) {
    Man = Base.appendChild(document.createElement("<img alt='Man' src='boxman.bmp' style='position:absolute;left:" + x * MapW + ";top:" + y * MapH + ";width:" + MapW + ";height:" + MapH + ";' class='Man'>"));
    Man.x = x;
    Man.y = y;
    MainMap[y][x] = (k == 0) ? ' ' : '.';
}

function init() {
    MainMap = [];

    RePlayTime = 10;
    MapW = MapH = 30;
    PushScrollNo = 30;
    BoxCompletes = 0;
    TotalBox = 0;

    Timer = null;
    canMove = true;
    BoxMoves = 0;
    Count = -1;
    BackRecord = [];
    BoxMoveInfo.value = 0;
    ManMoveInfo.value = 0;
    LevelInfo.value = parseInt(useLevel) + 1;
}

function Dir(x, y, k) {
    if (!canMove) return;
    var ManFront = MainMap[y + parseInt(Man.y)][x + parseInt(Man.x)];
    if (ManFront == ' ' || ManFront == '.')
        if (k != null) Move1(x, y, k.toLowerCase());
        else Move1(x, y);
    else {
        if (typeof (ManFront) == 'object') {
            var ManFrontFront = MainMap[2 * y + parseInt(Man.y)][2 * x + parseInt(Man.x)];
            if (ManFrontFront == ' ') {
                if (k != null) Move1(x, y, k.toUpperCase());
                else Move1(x, y);
                Move2(ManFront, x, y);
            } else if (ManFrontFront == '.') {
                if (k != null) Move1(x, y, k.toUpperCase());
                else Move1(x, y);
                Move3(ManFront, x, y);
            }
            BoxMoves++;
        }
    }
}

function Move1(x, y, k) {
    if (k != null) {
        BackRecord[++Count] = k;
        BackRecord.length = Count + 1;
    }
    Man.x = x + parseInt(Man.x);
    Man.y = y + parseInt(Man.y);
    Man.style.left = Man.x * MapW;
    Man.style.top = Man.y * MapH;
}

function Move2(obj, x, y) {
    obj.style.left = (x + Man.x) * MapW;
    obj.style.top = (y + Man.y) * MapH;
    MainMap[y + parseInt(Man.y)][x + parseInt(Man.x)] = obj;
    if (obj.complete == 0) MainMap[Man.y][Man.x] = ' ';
    else {
        MainMap[Man.y][Man.x] = '.';
        BoxCompletes--;
    }
    obj.complete = 0;
}

function Move3(obj, x, y) {
    obj.style.left = (x + Man.x) * MapW;
    obj.style.top = (y + Man.y) * MapH;
    MainMap[y + parseInt(Man.y)][x + parseInt(Man.x)] = obj;
    if (obj.complete == 1) MainMap[Man.y][Man.x] = '.';
    else {
        MainMap[Man.y][Man.x] = ' ';
        if (++BoxCompletes == TotalBox) {
            oWin();
            return;
        }
    }
    obj.complete = 1;
}

function UnDo() {
    if (Count >= 0) {
        canMove = true;
        switch (BackRecord[Count]) {
        case 'l':
            Move1(1, 0);
            break; //left -> right
        case 'u':
            Move1(0, 1);
            break; //up -> down
        case 'r':
            Move1(-1, 0);
            break; //right -> left
        case 'd':
            Move1(0, -1);
            break; //down -> up
        case 'L':
            UnGo(1, 0);
            break; //left -> right
        case 'U':
            UnGo(0, 1);
            break; //up -> down
        case 'R':
            UnGo(-1, 0);
            break; //right -> left
        case 'D':
            UnGo(0, -1);
            break; //down -> up
        }
        iSelects(--Count);
    }
}

function UnGo(x, y) {
    BoxMoves--;
    var obj = MainMap[-y + parseInt(Man.y)][-x + parseInt(Man.x)];
    if (MainMap[Man.y][Man.x] == ' ') {
        if (obj.complete == 0) MainMap[-y + parseInt(Man.y)][-x + parseInt(Man.x)] = ' ';
        else {
            MainMap[-y + parseInt(Man.y)][-x + parseInt(Man.x)] = '.';
            BoxCompletes--;
        }
        obj.complete = 0;
    } else {
        if (obj.complete == 0) {
            MainMap[-y + parseInt(Man.y)][-x + parseInt(Man.x)] = ' ';
            if (++BoxCompletes == TotalBox) {
                oWin();
                return;
            }
        } else MainMap[-y + parseInt(Man.y)][-x + parseInt(Man.x)] = '.';
        obj.complete = 1;
    }
    obj.style.left = Man.x * MapW;
    obj.style.top = Man.y * MapH;
    MainMap[Man.y][Man.x] = obj;
    Move1(x, y);
}

function ReDo() {
    if (Count + 1 < BackRecord.length) {
        switch (BackRecord[++Count]) {
        case 'l':
        case 'L':
            Dir(-1, 0);
            break; //left
        case 'u':
        case 'U':
            Dir(0, -1);
            break; //up
        case 'r':
        case 'R':
            Dir(1, 0);
            break; //right
        case 'd':
        case 'D':
            Dir(0, 1);
            break; //down
        }
        iSelects(Count);
    } else clearInterval(Timer);
}

function oWin() {
    canMove = false;
    if (useLevel == Map.length) {
        alert("��ϲ������ ���Ѿ�ȫ��ͨ�أ�");
    } else {
        alert("��ϲ�����������˵� " + (useLevel + 1) + " �أ�");
        useLevel++;
        ReadMap(useLevel);
        window.focus();
        Base.focus();
        BoxMoves = -1;
    }
}


function Run() {
    var temp = Info.value;
    if (temp == '') return;
    ReadMap(useLevel);
    BackRecord = temp.split("")
    Timer = setInterval(ReDo, RePlayTime);
}

function iSelects(x) {
    var iRange = Info.createTextRange();
    iRange.collapse(true);
    iRange.moveStart("character", x);
    iRange.moveEnd("character", 1);
    iRange.select();
    BoxMoveInfo.value = BoxMoves;
    ManMoveInfo.value = x + 1;
}

function GetCookie(sName) {
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (sName == aCrumb[0])
            return unescape(aCrumb[1]);
    }
    return 0;
}

function SetCookie(sName, sValue) {
    dt = new Date();
    dt.setTime(dt.getTime() + (365 * 24 * 3600 * 1000));
    document.cookie = sName + "=" + escape(sValue) + "; expires=" + dt.toGMTString();
}

function SaveLevel() {
    SetCookie("Level", useLevel);
    SetCookie("Move", Info.value);
    tmp = useLevel + 1;
    alert("������ " + tmp + " �����ݳɹ���");
}

function LoadLevel() {
    useLevel = GetCookie("Level");
    ReadMap(parseInt(useLevel));
    window.focus();
    Base.focus();
    Info.value = GetCookie("Move");
    Run();
    tmp = parseInt(useLevel) + 1;
    alert("�ɹ������� " + tmp + " �����ݣ�");
}

function CustomLevel() {
    totallevel = Map.length;
    tmp = useLevel + 1;
    var level = window.prompt("�ܹ��� " + totallevel + " �أ���ѡ����", tmp);
    if (level == null) return;
    if (parseInt(level) != "NaN" && level <= totallevel) {
        useLevel = level - 1;
        ReadMap(useLevel);
        window.focus();
        Base.focus();
    } else {
        alert("ѡ����������������");
    }
}