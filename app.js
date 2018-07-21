import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mathjs from 'mathjs';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

router.route('/number/:number').get((req, res) => {
    var number = req.params.number;
    var length = number.toString().length;
    var digits1 = (number).toString(10).split("").map(function (t) {
        return parseInt(t)
    });
    var digits = number.toString();

    const one = ['صفر', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const ten = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const hundred = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const categories = ['', 'هزار', 'میلیون', 'میلیارد', 'بیلیون', 'بیلیارد', 'تریلیون', 'تریلیارد', 'کوادریلیون'];
    const exceptions = ['', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const separate = " و ";

    if (length > 27)
        res.json({
            "error": "عدد بسیار بزرگ می باشد"
        });

    else {
        var i;
        var i_one;
        var i_ten;
        var i_hundred;
        var letters;
        var set_one;
        var set_ten;
        var set_hundred;
        var persianLetters = "";

        for (i = length - 1; i >= 0; i -= 3) {
            i_one = digits[i] ? digits[i] : -1;
            i_ten = digits[i - 1] ? digits[i - 1] : -1;
            i_hundred = digits[i - 2] ? digits[i - 2] : -1;

            set_one = false;
            set_ten = false;
            set_hundred = false;
            letters = '';
            //zero
            if (i_one == 0 && i_ten < 0 && i_hundred < 0) {
                letters = one[i_one];
            }

            //one
            if (i >= 0 && i_one > 0 && i_ten != 1 && one[i_one] !== 'undefined') {
                letters = one[i_one];
                set_one = true;
            }

            // ten
            if ((i - 1 >= 0) && i_ten > 0 && ten[i_ten] !== 'undefined') {
                if (set_one) {
                    letters = separate + letters;
                }
                if (i_one == 0) {
                    letters = ten[i_ten];
                } else if (i_ten == 1 && i_one > 0) {
                    letters = exceptions[i_one];
                } else {
                    letters = ten[i_ten] + letters;
                }

                set_ten = true;
            }

            // hundred
            if ((i - 2 >= 0) && i_hundred > 0 && hundred[i_hundred] !== 'undefined') {
                if (set_ten || set_one) {
                    letters = separate + letters;
                }

                letters = hundred[i_hundred] + letters;
                set_hundred = true;
            }

            if (i_one < 0 && i_ten < 1 && i_hundred < 1) {
                letters = '';
            } else {
                letters = letters + " " + categories[(length - i - 1) / 3];
            }

            if (letters > 0 && i >= 3) {
                letters = separate + letters;
            }
            persianLetters = letters + persianLetters;
        }
        res.json(persianLetters);
    }

});

app.use('/', router);

app.listen(3000);