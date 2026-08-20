let counter_1, counter_2, counter_3, counter_4;
let counter_side_1, counter_side_2, counter_side_3, counter_side_4;
let att_1, att_2, player_color_1, player_color_2, player_color_3, player_color_4;
let n_1, n_2, n_3, n_4, n_5, n_6;
let side_btn_1, side_btn_2, side_btn_3, side_btn_4;
let check_1, check_2, check_3, check_4;
let a_memorys, b_memorys;
let player_turn, player_name, player, turn, turn_line, player_sig;
let check_table, checks, menu, nav, pop_table, pop_help, page_main;
let header = ["Eg", "St", "Esc", "St"]
let ability_selects;
const f_memory = [false, false, false, false, 0, 0, 0, 0, 0, 0];
// 1ターンの記録は f_memory の後ろに特性A〜Dの選択状態が続く形
const ability_offset = f_memory.length;
// 履歴表に最低限表示するターン数
const history_turns = 15;

// 特性を追加するときはこの配列に1行足すだけでよい。4つのプルダウン全てに反映される。
const abilities = [
    {name: "おくのて", value: "LastDitch"},
    {name: "さかてにとる", value: "FlipTheScript"},
    {name: "おつかいダッシュ", value: "RunErrand"},
    {name: "アドレナブレイン", value: "AdrenaBrain"},
    {name: "みどりのまい", value: "TealDance"},
    {name: "ていさつしれい", value: "ReconDirective"},
    {name: "ルナサイクル", value: "LunarCycle"},
    {name: "スカイドロー", value: "SkyDraw"},
    {name: "ドンドンだいこ", value: "BoomGroove"}
];
const ability_slots = [
    {id: "AbiA-select", label: "特性 A", value: "AbilityA"},
    {id: "AbiB-select", label: "特性 B", value: "AbilityB"},
    {id: "AbiC-select", label: "特性 C", value: "AbilityC"},
    {id: "AbiD-select", label: "特性 D", value: "AbilityD"}
];

function default_abilities() {
    var values = [];
    for (var s = 0; s < ability_slots.length; s++) {
        values.push(ability_slots[s].value);
    }
    return values;
}

function read_abilities() {
    var values = [];
    for (var s = 0; s < ability_selects.length; s++) {
        values.push(ability_selects[s].value);
    }
    return values;
}

function write_abilities(values) {
    for (var s = 0; s < ability_selects.length; s++) {
        ability_selects[s].value = values[s];
    }
}

function init_ability_selects() {
    ability_selects = [];
    for (var s = 0; s < ability_slots.length; s++) {
        var slot = ability_slots[s];
        var select = document.getElementById(slot.id);
        select.appendChild(new Option(slot.label, slot.value));
        for (var a = 0; a < abilities.length; a++) {
            select.appendChild(new Option(abilities[a].name, abilities[a].value));
        }
        ability_selects.push(select);
    }
}

function new_memory(base_abilities) {
    return f_memory.slice().concat(base_abilities || default_abilities());
}

// 未到達のターンは参照時に作る。特性の選択状態は同じプレイヤーの直前のターンから引き継ぐ。
function get_memory(memorys, turn) {
    if (memorys[turn] === undefined) {
        var base = null;
        for (var t = turn - 1; t >= 1; t--) {
            if (memorys[t] !== undefined) {
                base = memorys[t].slice(ability_offset);
                break;
            }
        }
        memorys[turn] = new_memory(base);
    }
    return memorys[turn];
}

function chenge_color(target, player_name) {
    if (target == "energy") {
        if (checks[0].checked) {
            check_1.style.background = "#7c7c7c";
        } else {
            check_1.style.background = "#0a8b2a";
        }
    }
    else if (target == "support") {
        if (checks[1].checked) {
            check_2.style.background = "#7c7c7c";
        } else {
            check_2.style.background = "#0a8b2a";
        }
    }
    else if (target == "escape") {
        if (checks[2].checked) {
            check_3.style.background = "#7c7c7c";
        } else {
            check_3.style.background = "#0a8b2a";
        }
    } 
    else if (target == "stadium") {
        if (checks[3].checked) {
            check_4.style.background = "#7c7c7c";
        } else {
            check_4.style.background = "#0a8b2a";
        }
    } 
    else if (target == "turn") {
        if (player_name == "先攻") {
            turn_line.style.background = "#d11e1e";
            player.style.color = "#d11e1e";
        } else if (player_name == "後攻") {
            turn_line.style.background = "#3657be";
            player.style.color = "#3657be";
        }
    }
}

function reset_color(player_name) {
    chenge_color("energy");
    chenge_color("support");
    chenge_color("escape");
    chenge_color("stadium");
    chenge_color("turn", player_name);
}

function paging(value) {
    // 格納
    var memory = [];
    for (let i = 0; i < checks.length; i++) {
        memory.push(checks[i].checked);
    }
    memory.push(n_1);
    memory.push(n_2);
    memory.push(n_3);
    memory.push(n_4);
    if (att_1[0].textContent == "先攻") {
        memory.push(n_5);
        memory.push(n_6);
    } else if (att_1[0].textContent == "後攻") {
        memory.push(n_6);
        memory.push(n_5);
    }
    memory = memory.concat(read_abilities());

    if (player_name == "先攻") {
        a_memorys[player_turn] = memory;
    } else if (player_name == "後攻") {
        b_memorys[player_turn] = memory;
    }

    // ターンの切り替え
    if (player_name == "先攻") {
        if (value == "previous" & player_turn > 1) {
            player_name = "後攻";
            player_turn -= 1;
            turn.innerHTML = player_turn;
        } else if (value == "next") {
            player_name = "後攻";
        }
        player.innerHTML = player_name;
    } else if (player_name == "後攻") {
        player_name = "先攻"
        player.innerHTML = player_name;
        if (value == "next") {
            player_turn += 1;
            turn.innerHTML = player_turn;
        }
    }

    //カウンタの切り替え
    if (player_name == "先攻") {
        var n_memory = get_memory(a_memorys, player_turn)
    } else if (player_name == "後攻") {
        var n_memory = get_memory(b_memorys, player_turn)
    }
    checks[0].checked = n_memory[0];
    checks[1].checked = n_memory[1];
    checks[2].checked = n_memory[2];
    checks[3].checked = n_memory[3];
    reset_color(player_name);
    n_1 = n_memory[4];
    n_2 = n_memory[5];
    n_3 = n_memory[6];
    n_4 = n_memory[7];
    if (att_1[0].textContent == "先攻") {
        n_5 = n_memory[8];
        n_6 = n_memory[9];
    } else if (att_1[0].textContent == "後攻") {
        n_5 = n_memory[9];
        n_6 = n_memory[8];
    }
    write_abilities(n_memory.slice(ability_offset));
    counter_1.innerHTML = n_1;
    counter_2.innerHTML = n_2;
    counter_3.innerHTML = n_3;
    counter_4.innerHTML = n_4;
    counter_side_3.innerHTML = n_5;
    counter_side_4.innerHTML = n_6;
}

function addCount(num, sign){
    // 値設定
    if (sign == "+") {
        value = 1;
    } else if (sign == "-") {
        value = -1;
    }
    // 計算
    if (num == 1) {
        n_1 += value;
        if (n_1 < 0) {
            n_1 = 0;
        }
    }
    else if (num == 2) {
        n_2 += value;
        if (n_2 < 0) {
            n_2 = 0;
        }
    }
    else if (num == 3) {
        n_3 += value;
        if (n_3 < 0) {
            n_3 = 0;
        }
    }
    else if (num == 4) {
        n_4 += value;
        if (n_4 < 0) {
            n_4 = 0;
        }
    }
    else if (num == 5) {
        turn_side_num = n_5 + value;
        total_side_num = parseInt(counter_side_1.textContent) - value;
        if (total_side_num < 0) {
            alert(att_1[0].textContent + "プレイヤーのサイドは0枚です。")
        } else if (total_side_num < 7) {
            if (!(turn_side_num < 0)) {
                n_5 = turn_side_num;
                counter_side_1.innerHTML = total_side_num;
            }
        }
    }
    else if (num == 6) {
        turn_side_num = n_6 + value;
        total_side_num = parseInt(counter_side_2.textContent) - value;
        if (total_side_num < 0) {
            alert(att_2[0].textContent + "プレイヤーのサイドは0枚です。")
        } else if (total_side_num < 7) {
            if (!(turn_side_num < 0)) {
                n_6 = turn_side_num;
                counter_side_2.innerHTML = total_side_num;
            }
        }
    }
    else if (num == 0) {
        n_1 = 0;
        n_2 = 0;
        n_3 = 0;
        n_4 = 0;
        n_5 = 0;
        n_6 = 0;
    }
    counter_1.innerHTML = n_1;
    counter_2.innerHTML = n_2;
    counter_3.innerHTML = n_3;
    counter_4.innerHTML = n_4;
    counter_side_3.innerHTML = n_5;
    counter_side_4.innerHTML = n_6;
}
function active_help() {
    if (pop_help.classList.contains("open-menu")) {
        pop_help.classList.remove("open-menu");
        page_main.classList.remove("open-menu")
    } else {
        pop_help.classList.add("open-menu");
        page_main.classList.add("open-menu")
    }
}

function check_memory_utils(row, memory) {
    var record = memory[target_key] === undefined ? f_memory : memory[target_key];
    for (c=0; c<header.length; c++) {
        var td = document.createElement("td");
        td.classList.add("player_table_td")
        row.appendChild(td);
        if (record[c] === undefined) {
            td.innerHTML = "";
        } else {
            if (record[c]) {
                td.innerHTML = "〇";
            } else {
                td.innerHTML = "-";
            }
        }
    }
    return row
}
function check_memory() {
    var table = document.getElementById("player_table");
    turns = Math.max(history_turns, Object.keys(a_memorys).length, Object.keys(b_memorys).length);
    // 行を追加
    for (var r=0; r<turns; r++) {
        var row = table.insertRow(-1);
        target_key = 1 + r;
        if (att_1[0].textContent == "先攻") {
            check_memory_utils(row, a_memorys);
        } else if (att_1[0].textContent == "後攻") {
            check_memory_utils(row, b_memorys);
        }
        var td = document.createElement("td");
        td.classList.add("player_table_td")
        row.appendChild(td);
        td.innerHTML = target_key;
        if (att_1[0].textContent == "先攻") {
            check_memory_utils(row, b_memorys);
        } else if (att_1[0].textContent == "後攻") {
            check_memory_utils(row, a_memorys);
        }
    }
    // ボタン追加
    var row = table.insertRow(-1);
    var td = document.createElement("td");
    td.classList.add("btn_td")
    var input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("class", "pop_btn");
    input.setAttribute("onclick", "pop_close()");
    input.setAttribute("value", "閉じる");
    td.setAttribute("colspan", 9);
    td.appendChild(input);
    row.appendChild(td);
    if (pop_table.classList.contains("open-menu")) {
        pop_table.classList.remove("open-menu");
    } else {
        pop_table.classList.add("open-menu");
    }
}

function pop_close(flag) {
    if (pop_table.classList.contains("open-menu")) {
        pop_table.classList.remove("open-menu");
        var table = document.getElementById("player_table");
        for (r=table.rows.length-1; r>1; r--) {
            table.deleteRow(r);
        }
    } else if (flag){
        pop_table.classList.add("open-menu");
    }
}

function memory_clear() {
    flag = confirm("試合記録を削除しますか？");

    if ( flag == true ){
        player_name = "先攻";
        player.innerHTML = player_name;
        player_turn = 1;
        turn.innerHTML = player_turn;
        a_memorys = {};
        b_memorys = {};
        write_abilities(default_abilities());
        check_reset();
        counter_side_1.innerHTML = 6;
        counter_side_2.innerHTML = 6;
        pop_close(false);
        alert("記録を削除しました");
    }
}

function check_reset() {
    for (let i = 0; i < checks.length; i++) {
        checks[i].checked = false;
    }
    counter_side_1.innerHTML = parseInt(counter_side_1.textContent) + n_5;
    counter_side_2.innerHTML = parseInt(counter_side_2.textContent) + n_6;
    addCount(0);
    reset_color(player_name);
    pop_close(false);
}

function pullDown(flag) {
    if (nav.classList.contains("open-menu")) {
        nav.classList.remove("open-menu")
        page_main.classList.remove("open-menu")
        pop_close(false)
    } else {
        nav.classList.add("open-menu")
        page_main.classList.add("open-menu")
    }
}

function change_att() {
    if (att_1[0].textContent == "先攻") {
        att_1[0].innerHTML = "後攻";
        att_1[1].innerHTML = "後攻";
        att_2[0].innerHTML = "先攻";
        att_2[1].innerHTML = "先攻";
        player_color_1[0].style.borderBottomColor = "#3657be";
        player_color_1[0].style.color = "#3657be";
        player_color_2[0].style.borderBottomColor = "#d11e1e";
        player_color_2[0].style.color = "#d11e1e";
        player_color_3[0].style.backgroundColor = "#3657be";
        player_color_4[0].style.backgroundColor = "#d11e1e";
        player_color_5[0].style.backgroundColor = "#3657be";
        player_color_6[0].style.backgroundColor = "#d11e1e";
        tmp = counter_side_1.textContent;
        counter_side_1.innerHTML = counter_side_2.textContent;
        counter_side_2.innerHTML = tmp;
        tmp = n_5;
        n_5 = n_6;;
        n_6 = tmp;
        counter_side_3.innerHTML = n_5;
        counter_side_4.innerHTML = n_6;
    } else if (att_1[0].textContent == "後攻") {
        att_1[0].innerHTML = "先攻";
        att_1[1].innerHTML = "先攻";
        att_2[0].innerHTML = "後攻";
        att_2[1].innerHTML = "後攻";
        player_color_1[0].style.borderBottomColor = "#d11e1e";
        player_color_1[0].style.color = "#d11e1e";
        player_color_2[0].style.borderBottomColor = "#3657be";
        player_color_2[0].style.color = "#3657be";
        player_color_3[0].style.backgroundColor = "#d11e1e";
        player_color_4[0].style.backgroundColor = "#3657be";
        player_color_5[0].style.backgroundColor = "#d11e1e";
        player_color_6[0].style.backgroundColor = "#3657be";
        tmp = counter_side_1.textContent;
        counter_side_1.innerHTML = counter_side_2.textContent;
        counter_side_2.innerHTML = tmp;
        tmp = n_5;
        n_5 = n_6;;
        n_6 = tmp;
        counter_side_3.innerHTML = n_5;
        counter_side_4.innerHTML = n_6;
    }

}

window.addEventListener("load", ()=>{
    // 起動時の処理
    counter_1 = document.getElementById("counter-1");
    counter_2 = document.getElementById("counter-2");
    counter_3 = document.getElementById("counter-3");
    counter_4 = document.getElementById("counter-4");
    counter_side_1 = document.getElementById("counter-side-1");
    counter_side_2 = document.getElementById("counter-side-2");
    counter_side_3 = document.getElementById("counter-side-3");
    counter_side_4 = document.getElementById("counter-side-4");
    att_1 = document.getElementsByClassName("att_1");
    att_2 = document.getElementsByClassName("att_2");
    player_color_1 = document.getElementsByClassName("side-count-label");
    player_color_2 = document.getElementsByClassName("side-count-label second");
    player_color_3 = document.getElementsByClassName("side-count-txt");
    player_color_4 = document.getElementsByClassName("side-count-txt second");
    player_color_5 = document.getElementsByClassName("side-count-number");
    player_color_6 = document.getElementsByClassName("side-count-number second");
    check_1 = document.getElementById("check_energy");
    check_2 = document.getElementById("check_support");
    check_3 = document.getElementById("check_escape");
    check_4 = document.getElementById("check_stadium");
    checks = document.getElementsByClassName("label-check");
    player = document.getElementById("player");
    turn_line = document.getElementById("turn-line");
    turn = document.getElementById("turn");
    menu = document.getElementById("menu");
    page_main = document.getElementById("main_cover");
    nav = document.getElementById("g-nav");
    pop_table = document.getElementById("check-table-box");
    pop_help = document.getElementById("help-table-box");
    side_btn_1 = document.getElementById("side_1_down");
    side_btn_2 = document.getElementById("side_1_up");
    side_btn_3 = document.getElementById("side_2_down");
    side_btn_4 = document.getElementById("side_2_up");
    n_1 = 0;
    n_2 = 0;
    n_3 = 0;
    n_4 = 0;
    n_5 = 0;
    n_6 = 0;
    player_name = "先攻";
    player_turn = 1;
    check_1.style.background = "#0a8b2a";
    check_2.style.background = "#0a8b2a";
    check_3.style.background = "#0a8b2a";
    check_4.style.background = "#0a8b2a";
    a_memorys = {};
    b_memorys = {};
    init_ability_selects();
});
