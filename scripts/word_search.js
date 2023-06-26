console.log('imported word_search.js');

var id_board = "id_board";
var id_words = "id_words";
var rows = 14;
var columns = 14;
var count_words = 14;
var letters_array = [];
var words_array = [];
var selected_array = [];
var answers = [];
var answers_count = 0;
var guess = [];
var guess_count = 0;
var highlight_count = 0;

function board_default(){
    board_set(rows, columns);
}
async function board_set(board_rows, board_columns) {

    console.log('rows:' + board_rows + ':columns:' + board_columns);

    let view_width = get_css_variable('--search-max-width');
    let view_column_width = (view_width / board_columns) + '%';

    document.documentElement.style.setProperty('--search-column-width', view_column_width);
    document.documentElement.style.setProperty('--search-rows', board_rows);
    document.documentElement.style.setProperty('--search-columns', board_columns );

    board_rows++;
    board_columns++;

    for (let a = 1; a < board_rows; a++) {
        letters_array[a] = [];
        for (let b = 1; b < board_columns; b++) {
            letters_array[a][b] = '?';
        }
    }
    
    let temp_count = 0;
    let passed = false;

    for (let i = 0; i < words_array.length; i++) {
        temp_count = 0;
        while (passed === false) {
            passed = try_word(words_array[i], random_x(rows), random_y(columns), random_direction());
            if (temp_count > 50) {
                passed = true;
                words_array.splice(i, 1);
                i--;
            } else {
                temp_count++;
            }
        }
        passed = false;
        temp_count = 0;
    }

    words_list_set(words_array.length);

    let tile_id = "";
    let tile_value = "A";
    let board_start = '<button id="';
    let board_middle_1 = '" class="letter" onclick="letter_click(\'';
    let board_middle_2 = '\')">';
    let board_end = '</button>';
    let html_export = "";
    for (let x = 1; x < board_rows; x++ ) {
        for (let y = 1; y < board_columns; y++ ) {
            if (x > 9) {
                tile_id = "R" + x.toString();
            } else {
                tile_id = "R0" + x.toString();
            }
            if (y > 9) {
                tile_id = tile_id + "C" + y.toString();
            } else {
                tile_id = tile_id + "C0" + y.toString();
            }
            html_export = html_export + board_start + tile_id + board_middle_1 + tile_id + board_middle_2 + letters_array[x][y] + board_end;
        }
        tile_id = "";
    }

    board_rows--;
    board_columns--;
    
    let board_id = document.getElementById(id_board);
    board_id.innerHTML = html_export;
    for (let i = 0; i < answers.length; i++) {
        answers_highlight(i);
    }
    fill_missing();
}
async function words_list_set(word_count) {

    let word_start = "<p class='word word-";
    let word_mid =  "' id='word_";
    let word_middle = "'>";
    let word_end = "</p>";

    let temp = "";
    let html_export = "";

    for (let i = 0; i < word_count; i++) {
        temp = word_start + i + word_mid + i + word_middle + words_array[i] + word_end;
        html_export = html_export + temp;
        temp = "";
    }
    let word_id = document.getElementById(id_words);
    word_id.innerHTML = html_export;

}
function letter_click(id_location){
    console.log('clicked:' + id_location);

    let array_classes = get_classes_on_id(id_location);

    console.log('id:' + id_location + ':classes:' + array_classes);

    let marked = false;
    let my_index = -1;

    for (let i = 0; i < array_classes.length; i++) {
        if (array_classes[i] === 'selected') {
            class_remove(id_location, 'selected');
            class_add(id_location, 'unselected');
            marked = true;
            my_index = guess.indexOf(id_location);
            console.log("guess_index:" + my_index + ":" + guess[my_index]);
            guess.splice(my_index, 1);
        } else if (array_classes[i] === 'unselected') {
            class_remove(id_location, 'unselected');
            class_add(id_location, 'selected');
            guess.push(id_location);
            marked = true;
            my_index = check_words();
            if (my_index != -1) {
                console.log('word_found:' + guess + ":" + answers[my_index]);
                answers_highlight(my_index);
                word_complete(my_index);
            } else {

            }
        } 
    }
    if (marked === false) {
        class_add(id_location, 'selected');
        guess.push(id_location);
        my_index = check_words();
        if (my_index != -1) {
            console.log('word_found:' + guess + ":" + answers[my_index]);
            answers_highlight(my_index);
            word_complete(my_index);
        } else {

        }
    }
}
function board_clear() {
    let board_id = document.getElementById(id_board);
    board_id.innerHTML = "";
}
function words_clear() {
    let board_id = document.getElementById(id_words);
    board_id.innerHTML = "";
    words_array = [];
}
function variables_clear() {
    letters_array = [];
    words_array = [];
    selected_array = [];
    answers = [];
    answers_count = 0;
}
function class_add(id_edit, class_new) {
    let id_field = document.getElementById(id_edit);
    id_field.classList.add(class_new);
}
function class_remove(id_edit, class_old) {
    let id_field = document.getElementById(id_edit);
    id_field.classList.remove(class_old);
}
function get_css_variable(css_name) {
    const css_variable = getComputedStyle(document.documentElement);
    return css_variable.getPropertyValue(css_name).trim();
}
function get_classes_on_id(id_from) {
    let my_id = document.getElementById(id_from);
    let my_classes = Array.from(my_id.classList);
    return my_classes;
}
function button_new_game() {
    console.log('button_new_game()');
    board_clear();
    words_clear();
    variables_clear();
    fetch_words(count_words);
}
function random_letter() {
    let random_number = Math.floor(Math.random() * 26) + 1;
    switch (random_number) {
        case 1: return 'A';
        case 2: return 'B';
        case 3: return 'C';
        case 4: return 'D';
        case 5: return 'E';
        case 6: return 'F';
        case 7: return 'G';
        case 8: return 'H';
        case 9: return 'I';
        case 10: return 'J';
        case 11: return 'K';
        case 12: return 'L';
        case 13: return 'M';
        case 14: return 'N';
        case 15: return 'O';
        case 16: return 'P';
        case 17: return 'Q';
        case 18: return 'R';
        case 19: return 'S';
        case 20: return 'T';
        case 21: return 'U';
        case 22: return 'V';
        case 23: return 'W';
        case 24: return 'X';
        case 25: return 'Y';
        case 26: return 'Z';
    }
    return '?';
}
function random_direction() {
    let random_number = Math.floor(Math.random() * 24) + 1;
    switch (random_number) {
        /* f=forward b=backwards u=up d=down l=left r=right */
        case 1: return 'frr';
        case 2: return 'fur';
        case 3: return 'fuu';
        case 4: return 'ful';
        case 5: return 'fll';
        case 6: return 'fdl';
        case 7: return 'fdd';
        case 8: return 'fdr';

        case 9: return 'brr';
        case 10: return 'bur';
        case 11: return 'buu';
        case 12: return 'bul';
        case 13: return 'bll';
        case 14: return 'bdl';
        case 15: return 'bdd';
        case 16: return 'bdr';

        case 17: return 'fur';
        case 18: return 'ful';
        case 19: return 'fdl';
        case 20: return 'fdr';

        case 21: return 'bur';
        case 22: return 'bul';
        case 23: return 'bdl';
        case 24: return 'bdr';

    }
    return '?';
}
function random_x(max_x) {
    return Math.floor(Math.random() * max_x) + 1;
}
function random_y(max_y) {
    return Math.floor(Math.random() * max_y) + 1;
}
function try_word(word_new, x_start, y_start, direction) {

    let x = x_start;
    let y = y_start;
    let x_direction = 0;
    let y_direction = 0;
    let temp_id = '';
    let array_id = [];
    let word_current = word_new;

    switch (direction) {
        case 'brr': x_direction = 1; y_direction = 0; word_current = string_reverse(word_new); break;
        case 'bur': x_direction = 1; y_direction = -1; word_current = string_reverse(word_new); break;
        case 'buu': x_direction = 0; y_direction = -1; word_current = string_reverse(word_new); break;
        case 'bul': x_direction = -1; y_direction = -1; word_current = string_reverse(word_new); break;
        case 'bll': x_direction = -1; y_direction = 0; word_current = string_reverse(word_new); break;
        case 'bdl': x_direction = -1; y_direction = 1; word_current = string_reverse(word_new); break;
        case 'bdd': x_direction = 0; y_direction = 1; word_current = string_reverse(word_new); break;
        case 'bdr': x_direction = 1; y_direction = 1; word_current = string_reverse(word_new); break;

        case 'frr': x_direction = 1; y_direction = 0; break;
        case 'fur': x_direction = 1; y_direction = -1; break;
        case 'fuu': x_direction = 0; y_direction = -1; break;
        case 'ful': x_direction = -1; y_direction = -1; break;
        case 'fll': x_direction = -1; y_direction = 0; break;
        case 'fdl': x_direction = -1; y_direction = 1; break;
        case 'fdd': x_direction = 0; y_direction = 1; break;
        case 'fdr': x_direction = 1; y_direction = 1; break;
    }

    for (let i = 0; i < word_current.length; i++) {
        if (x < 1 || y < 1 || x > rows || y > columns) {
            return false; // failed out of array bounds
        }
        if (letters_array[x][y] != '?') {
            if (letters_array[x][y] != word_current[i]) {
                return false;
            }
        } 
        x = x + x_direction;
        y = y + y_direction;
    }
    /* no errors ready to write */
    x = x_start;
    y = y_start;

    for (let i = 0; i < word_current.length; i++) {
        letters_array[x][y] = word_current[i];

        temp_id = coordinates_to_id_string(x, y);
        array_id[i] = temp_id;

        x = x + x_direction;
        y = y + y_direction;
    }
    answers[answers_count] = array_id;
    console.log('answers:' + answers[answers_count]); 
    answers_count++;
}

function string_reverse(word_new) {
    let reversed = "";
    for (let i = word_new.length - 1; i >= 0; i--) {
        reversed = reversed + word_new[i];
    }
        return reversed;
}
function coordinates_to_id_string(x_location, y_location) {
    let temp = '';
    if (x_location < 10) {
        temp = 'R0' + x_location;
    } else {
        temp = 'R' + x_location;
    }
    if (y_location < 10) {
        temp = temp + 'C0' + y_location;
    } else {
        temp = temp + 'C' + y_location;
    }
    return temp;
}
function answers_highlight(word_number) {
    let new_class = 'word-' + word_number;
    for (let i = 0; i < answers[word_number].length; i++) {
        class_add(answers[word_number][i], new_class);
    }
}
function fill_missing() {
    let temp_id = "";
    let board_element;
    for (let x = 1; x < letters_array.length; x++) {
        for (let y = 1; y < letters_array[1].length; y++) {
            if (letters_array[x][y] === '?') {
                letters_array[x][y] = random_letter();
                temp_id = coordinates_to_id_string(x, y);
                board_element = document.getElementById(temp_id);
                board_element.innerHTML = letters_array[x][y];
            }
        }
    }
}
function json_to_array(input_json) {
    let temp_string = '';
    let temp_array = [];

    for (let i = 0; i < input_json.length; i++) {
        temp_string = input_json[i];
        temp_string = temp_string.toUpperCase();
        temp_array[i] = temp_string;
    }
    let temp_count = 0;
    words_array = [];

    for (let i = 0; i < temp_array.length; i++) {
        if (temp_array[i].length < 15) {
            words_array[temp_count] = temp_array[i];
            temp_count++;
        }
    }
    return words_array;
}
function build_page(array_of_words) {
    board_set(rows, columns);
}
async function fetch_words(word_count) {
    let response = await fetch('https://random-word-api.herokuapp.com/word?number=' + word_count);
    let json_words = await response.json();
    words_array = await json_to_array(json_words);
    console.log('words_array:' + words_array);
    await build_page(words_array);
}
function word_complete(word_index) {
    highlight_on('.word-' + word_index, word_index);

    for (let i = 0; i < guess.length; i++) {
        class_remove(guess[i], 'selected');
    }
    guess = [];
}
function highlight_on(css_variable, css_number) {

    let element = document.querySelectorAll(css_variable);

    element.forEach(element => {
        let text_color = 'var(--color-' + css_number.toString() + ')';
        let back = 'var(--color-' + css_number.toString() + ')';
        let font = 'var(--color-background)';
        let opacity = 'opacity: 0.4';

        element.style.backgroundColor = back;
        element.style.color = font;
        element.style.opacity = opacity;
    });
}
function highlight_off(css_variable ) {
    
    let element = document.querySelectorAll(css_variable);

    element.forEach(element => {
        let back = 'var(--color-background' + ')';
        let font = 'var(--color-text)';
        let opacity = 'opacity: 0';
        element.style.backgroundColor = back;
        element.style.color = font;
        element.style.opacity = opacity;
    });
}
function check_words() {
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].length === guess.length) {
            if (same_array(answers[i], guess)) {
                return i;
            }
        }
    }
    return -1;
}
function same_array(array_1, array_2) {
    if (array_1.length !== array_2.length) {
        return false;
    }
    return array_1.every(value => array_2.includes(value));
}
fetch_words(count_words);