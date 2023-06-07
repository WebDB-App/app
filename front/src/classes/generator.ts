import { TypeName } from "./driver";
import { Configuration } from "./configuration";

export enum Dictionnary {
	Latin = 'Latin',
	Arab = 'Arab',
	Cyrillic = 'Cyrillic',
	Chinese = 'Chinese',
	Japanese = 'Japanese'
}

export interface Group {
	name: string;
	values: {
		name: string,
		type: TypeName[];
		fct: string
	}[];
}

const translation: any = {
	'Latin': {
		firstName: '(() => {const names = ["Jacob","Michael","Ethan","Joshua","Daniel","Alexander","Chloe","Samantha","Addison","Natalie","Mia","Alexis","Alyssa","Hannah","Ashley","Ella","Sarah","Grace","Taylor"];return names[Math.floor(Math.random() * (names.length))]})()',
		lastName: '(() => {const names = ["Smith","Johnson","Williams","Brown","Jones","Miller","Davis","John","Doe","Jackson","Jordan","Lopez","Martin","Rousse","Bellanger","Maunier","Lopez","Robert","Dupont"];return names[Math.floor(Math.random() * (names.length))]})()',
		lorem: "(() => {const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut'];const result = [];for (var j = 0; j < Math.floor(Math.random() * 300); j++) {  result.push(words[Math.floor(Math.random() * words.length)]) }return result.join(', ')})()",
		fullAddress: "(() => {var streetNumber = ['25489', '87459', '35478', '15975', '95125', '78965'] var streetName = ['A street', 'B street', 'C street', 'D street', 'E street', 'F street',] var cityName = ['Riyadh', 'Dammam', 'Jedda', 'Tabouk', 'Makka', 'Maddena', 'Haiel'] var stateName = ['Qassem State', 'North State', 'East State', 'South State', 'West State'] var zipCode = ['28889', '96459', '35748', '15005', '99625', '71465'] function getRandom(input) { return input[Math.floor((Math.random() * input.length))]; }; return `${getRandom(streetNumber)} ${getRandom(streetName)} ${getRandom(cityName)} ${getRandom(stateName)} ${getRandom(zipCode)}`;})()",
		city: '(() => {const names = ["New York", "Los Angeles", "Chicago", "Houston", "Philadelphia", "Phoenix", "San Diego", "San Antonio", "Dallas", "Detroit", "San Jose", "Indianapolis", "Jacksonville", "San Francisco", "Columbus", "Austin", "Memphis", "Baltimore", "Charlotte", "Fort Worth", "Boston", "Milwaukee", "El Paso", "Washington", "Nashville-Davidson", "Seattle", "Denver", "Las Vegas", "Portland", "Oklahoma City", "Tucson", "Albuquerque", "Atlanta", "Long Beach", "Kansas City", "Fresno", "New Orleans", "Cleveland", "Sacramento", "Mesa", "Virginia Beach", "Omaha", "Colorado Springs", "Oakland", "Miami", "Tulsa", "Minneapolis", "Honolulu", "Arlington", "Wichita", "St. Louis", "Raleigh", "Santa Ana", "Cincinnati", "Anaheim", "Tampa", "Toledo", "Pittsburgh", "Aurora", "Bakersfield", "Riverside", "Stockton", "Corpus Christi", "Lexington-Fayette", "Buffalo", "St. Paul", "Anchorage", "Newark", "Plano", "Fort Wayne", "St. Petersburg", "Glendale", "Lincoln", "Norfolk", "Jersey City", "Greensboro", "Chandler", "Birmingham", "Henderson", "Scottsdale", "North Hempstead", "Madison", "Hialeah", "Baton Rouge", "Chesapeake", "Orlando", "Lubbock", "Garland", "Akron", "Rochester", "Chula Vista", "Reno", "Laredo", "Durham", "Modesto", "Huntington", "Montgomery", "Boise", "Arlington", "San Bernardino"];return names[Math.floor(Math.random() * (names.length))]})()',
		street: '(() => {const names = ["Arlington Avenue", "Andover Court", "Windsor Drive", "Atlantic Avenue", "Cottage Street", "Arlington Avenue", "Charles Street", "Grand Avenue", "Ann Street", "Main Street", "Jefferson Avenue", "Boulevard Albert Einstein", "Rue Roland Garros"];return names[Math.floor(Math.random() * (names.length))]})()',
		country : '(() => {const country = ["Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bonaire", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo (Democratic Republic of the)", "Cook Islands", "Costa Rica", "Côte d\'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (Democratic People\'s Republic of)", "Korea (Republic of)", "Kuwait", "Kyrgyzstan", "Lao People\'s Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia (the former Yugoslav Republic of)", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia (Federated States of)", "Moldova (Republic of)", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russian Federation", "Rwanda", "Saint Barthélemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Republic of China", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom of Great Britain and Northern Ireland", "United States of America", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"]; return country[Math.floor(Math.random() * country.length)]})()'
	},
	'Arab': {
		firstName: '(() => {const names = ["عدنان","عروة","عمار","غازي","كنعان","لقمان","لؤي","ليث","ماجد","مازن","مأمون","محمد","محمد نور","مرهف","مسعود","مشاري","مشعل","مصطفى","نبيلة","نجود","ندى","نرمين","نشوى","نغم","نهى","نوال","نورا","نوفة","هالة","هبة","هدى","هديل","هلا","هنادي","هند","هيفاء","وداد","وعد","ولاء","يمنى"];return names[Math.floor(Math.random() * (names.length))]})()',
		lastName: '(() => {const names = ["أسعد","الأحمد","الأسعد","البشير","البكور","الحداد","الحسني","الحسين","الحسيني","الحلبوني","الحلبي","الحمصي","الحمود","الحموي","الروح","السحار","الشامي","الشققي","الصالح","الطويل","العمر","القيسي","المصري","المنجد","الموصلي","النجار","باذنجان","بارودي","بكور","تركاوي","حديد","حسين","حوراني","خليل","دياب","ريس","زكار","شعار","عبد الرؤوف","عثمان","عرابي","عمر","قصاب","قطان","لاذقاني","مؤذن"]; return names[Math.floor(Math.random() * (names.length))]})()',
		lorem: '(() => {const words = ["وين" ,"عندى" ,"الكويتية" ,"الرأي" ,"الثائر" ,"كنت" ,"للسلام" ,"المنطقة" ,"أصبحوا" ,"السياسي" ,"البحرين" ,"يقصده" ,"انهم" ,"الكرامة" ,"يرى" ,"الميادين" ,"النووي" ,"لأميركا"];const result = [];for (var j = 0; j < Math.floor(Math.random() * 300); j++) {  result.push(words[Math.floor(Math.random() * words.length)]) }return result.join(" ,")})()',
		fullAddress: "(() => {var streetNumber = ['25489', '87459', '35478', '15975', '95125', '78965'] var streetName = ['A street', 'B street', 'C street', 'D street', 'E street', 'F street',] var cityName = ['Riyadh', 'Dammam', 'Jedda', 'Tabouk', 'Makka', 'Maddena', 'Haiel'] var stateName = ['Qassem State', 'North State', 'East State', 'South State', 'West State'] var zipCode = ['28889', '96459', '35748', '15005', '99625', '71465'] function getRandom(input) { return input[Math.floor((Math.random() * input.length))]; }; return `${getRandom(streetNumber)} ${getRandom(streetName)} ${getRandom(cityName)} ${getRandom(stateName)} ${getRandom(zipCode)}`;})()",
		city: '(() => {const names = ["تبوك", "نعمي", "الرياض", "حميط", "الطائف", "مكة المكرمة", "رجم الطيارة", "الثميد", "عسيلة", "حائل", "بريدة", "الهفوف", "الدمام", "المدينة المنورة", "ابها", "حالة عمار", "جازان", "جدة", "الشايب", "الفوهة", "اللوز", "عين الأخضر", "ذات الحاج", "المجمعة", "قيال", "الاخضر", "البديعة", "مغيرة", "الهوجاء", "البديع", "الخبر", "ابار قنا", "الجبعاوية", "الحميضة", "البيانة", "حقل", "الدرة", "الزيتة", "علقان", "الوادي الجديد", "مليح", "ابو الحنشان", "مقنا", "ابو قعر", "مركز العوجاء", "مركز العليمة", "حفر الباطن", "القلت", "النظيم", "ابن طوالة", "الصداوي", "ام قليب", "عريفج", "ابن شرار", "القيصومة", "الرقعي الجديدة", "ذبحة", "الصفيري", "الوايلية", "الفيوان", "الحماطيات", "خميس مشيط", "الجبو", "المسناة", "احد رفيده", "ام عشر الشرقية", "القطيف", "بوهان", "السنانيات", "حزايا", "أكباد", "بئر الحيز", "جريداء", "تيماء", "العسافية", "عردة", "الكتيب", "بئر فجر", "القليبة", "عنيزة", "الرافعية", "الكبريت", "رغوة", "حمى", "الزبر", "السفانية", "المحوى", "أم غور", "قرية العليا", "الرفيعة", "جرارة", "قرية", "البويبيات", "السعيرة", "مناخ", "الحيرا", "ام الشفلح", "اللهابة", "الفريدة", "الشامية", "العيطلية", "سحمة", "الشملول / ام عقلا", "ام الهوشات", "الشيط", "العاذرية", "الشيحية", "حزوة / العمانية", "القرعاء", "اللصافة", "النقيرة", "هجرة أولاد حثلين", "الجبيل", "فرزان", "النعيرية", "ام ضليع", "مليجة", "الصرار", "حنيذ", "مغطي", "شفية", "عتيق", "الحسي", "ثاج", "الحناة", "الكهفة", "الصحاف", "العيينة", "القليب", "الونان", "غنوى", "الزغين", "نطاع", "ام الحمام", "ام ربيعة", "ابو حدرية", "منيفة", "الافلاج", "خيطان", "الوسيعة", "تمرية", "ابو خسيفاء", "النخيل", "السحيمي", "مصدة", "أم سديرة", "التنهاة", "قري التويم", "الشحمة", "الودي", "جوي", "مقبلة", "حرمة", "المعظم", "جراب", "العقلة", "النغيق", "حويمضة", "البتيراء", "المشاش", "الفروثي", "جلاجل", "الدخيلة", "الحصون", "حوطة سدير", "روضة سدير", "تمير", "الارطاوية", "العمار", "الخيس", "المعشبة", "التويم", "الخطامة", "رويضة بوضاء", "الشعب", "عشيرة سدير", "الجنيفي", "العطار", "ام الجماجم", "مشلح", "ام رجوم", "الرويضة", "الفيصلية", "بوضاء", "الحائر", "وشي", "عودة سدير", "مبايض", "القاعية", "دبدبة فضلاء", "الحجب", "الضلفة", "أبو طاقة", "العين الجديدة", "قعرة الدومة", "أم زرب", "هدية", "القعرة", "العلا", "الجهراء", "رحيب", "شلال", "ضاعا", "جيدة", "قلبان عشرة", "النجيل", "الرزيقية", "الحميدية", "صدر"];return names[Math.floor(Math.random() * (names.length))]})()',
		street: '(() => {const names = ["Arlington Avenue", "Andover Court", "Windsor Drive", "Atlantic Avenue", "Cottage Street", "Arlington Avenue", "Charles Street", "Grand Avenue", "Ann Street", "Main Street", "Jefferson Avenue", "Boulevard Albert Einstein", "Rue Roland Garros"];return names[Math.floor(Math.random() * (names.length))]})()',
		country : '(() => {const country = ["أندورا" ,"الامارات العربية المتحدة" ,"أفغانستان" ,"أنتيجوا وبربودا" ,"أنجويلا" ,"ألبانيا" ,"أرمينيا" ,"أنجولا" ,"القطب الجنوبي" ,"الأرجنتين" ,"ساموا الأمريكية" ,"النمسا" ,"أستراليا" ,"آروبا" ,"جزر أولان" ,"أذربيجان" ,"البوسنة والهرسك" ,"بربادوس" ,"بنجلاديش" ,"بلجيكا" ,"بوركينا فاسو" ,"بلغاريا" ,"البحرين" ,"بوروندي" ,"بنين" ,"سان بارتيلمي" ,"برمودا" ,"بروناي" ,"بوليفيا" ,"بونير" ,"البرازيل" ,"الباهاما" ,"بوتان" ,"جزيرة بوفيه" ,"بتسوانا" ,"روسيا البيضاء" ,"بليز" ,"كندا" ,"جزر كوكوس" ,"جمهورية الكونغو الديمقراطية" ,"جمهورية افريقيا الوسطى" ,"الكونغو - برازافيل" ,"سويسرا" ,"ساحل العاج" ,"جزر كوك" ,"شيلي" ,"الكاميرون" ,"الصين" ,"كولومبيا" ,"كوستاريكا" ,"كوبا" ,"الرأس الأخضر" ,"كوراساو" ,"جزيرة الكريسماس" ,"قبرص" ,"جمهورية التشيك" ,"ألمانيا" ,"جيبوتي" ,"الدانمرك" ,"دومينيكا" ,"جمهورية الدومينيك" ,"الجزائر" ,"الاكوادور" ,"استونيا" ,"مصر" ,"الصحراء الغربية" ,"اريتريا" ,"أسبانيا" ,"اثيوبيا" ,"فنلندا" ,"فيجي" ,"جزر فوكلاند" ,"ميكرونيزيا" ,"جزر فارو" ,"فرنسا" ,"الجابون" ,"المملكة المتحدة" ,"جرينادا" ,"جورجيا" ,"غويانا" ,"غيرنزي" ,"غانا" ,"جبل طارق" ,"جرينلاند" ,"غامبيا" ,"غينيا" ,"جوادلوب" ,"غينيا الاستوائية" ,"اليونان" ,"جورجيا الجنوبية وجزر ساندويتش الجنوبية" ,"جواتيمالا" ,"جوام" ,"غينيا بيساو" ,"غيانا" ,"هونج كونج الصينية" ,"جزيرة هيرد وماكدونالد" ,"هندوراس" ,"كرواتيا" ,"هايتي" ,"المجر" ,"اندونيسيا" ,"أيرلندا" ,"اسرائيل" ,"جزيرة مان" ,"الهند" ,"المحيط الهندي البريطاني" ,"العراق" ,"ايران" ,"أيسلندا" ,"ايطاليا" ,"جيرسي" ,"جامايكا" ,"الأردن" ,"اليابان" ,"كينيا" ,"قرغيزستان" ,"كمبوديا" ,"كيريباتي" ,"جزر القمر" ,"سانت كيتس ونيفيس" ,"كوريا الشمالية" ,"كوريا الجنوبية" ,"الكويت" ,"جزر الكايمن" ,"كازاخستان" ,"لاوس" ,"لبنان" ,"سانت لوسيا" ,"ليختنشتاين" ,"سريلانكا" ,"ليبيريا" ,"ليسوتو" ,"ليتوانيا" ,"لوكسمبورج" ,"لاتفيا" ,"ليبيا" ,"المغرب" ,"موناكو" ,"مولدافيا" ,"الجبل الأسود" ,"سانت مارتين" ,"مدغشقر" ,"جزر المارشال" ,"مقدونيا" ,"مالي" ,"ميانمار" ,"منغوليا" ,"ماكاو الصينية" ,"جزر ماريانا الشمالية" ,"مارتينيك" ,"موريتانيا" ,"مونتسرات" ,"مالطا" ,"موريشيوس" ,"جزر الملديف" ,"ملاوي" ,"المكسيك" ,"ماليزيا" ,"موزمبيق" ,"ناميبيا" ,"كاليدونيا الجديدة" ,"النيجر" ,"جزيرة نورفوك" ,"نيجيريا" ,"نيكاراجوا" ,"هولندا" ,"النرويج" ,"نيبال" ,"نورو" ,"نيوي" ,"نيوزيلاندا" ,"عمان" ,"بنما" ,"بيرو" ,"بولينيزيا الفرنسية" ,"بابوا غينيا الجديدة" ,"الفيلبين" ,"باكستان" ,"بولندا" ,"سانت بيير وميكولون" ,"بتكايرن" ,"بورتوريكو" ,"فلسطين" ,"البرتغال" ,"بالاو" ,"باراجواي" ,"قطر" ,"روينيون" ,"رومانيا" ,"صربيا" ,"روسيا" ,"رواندا" ,"المملكة العربية السعودية" ,"جزر سليمان" ,"سيشل" ,"السودان" ,"السويد" ,"سنغافورة" ,"سانت هيلنا" ,"سلوفينيا" ,"سفالبارد وجان مايان" ,"سلوفاكيا" ,"سيراليون" ,"سان مارينو" ,"السنغال" ,"الصومال" ,"سورينام" ,"جنوب السودان" ,"ساو تومي وبرينسيبي" ,"السلفادور" ,"سينت مارتن" ,"سوريا" ,"سوازيلاند" ,"جزر الترك وجايكوس" ,"تشاد" ,"المقاطعات الجنوبية الفرنسية" ,"توجو" ,"تايلند" ,"طاجكستان" ,"توكيلو" ,"تيمور الشرقية" ,"تركمانستان" ,"تونس" ,"تونجا" ,"تركيا" ,"ترينيداد وتوباغو" ,"توفالو" ,"تايوان" ,"تانزانيا" ,"أوكرانيا" ,"أوغندا" ,"جزر الولايات المتحدة البعيدة الصغيرة" ,"الولايات المتحدة الأمريكية" ,"أورجواي" ,"أوزبكستان" ,"الفاتيكان" ,"سانت فنسنت وغرنادين" ,"فنزويلا" ,"جزر فرجين البريطانية" ,"جزر فرجين الأمريكية" ,"فيتنام" ,"فانواتو" ,"جزر والس وفوتونا" ,"ساموا" ,"كوسوفو" ,"اليمن" ,"مايوت" ,"جمهورية جنوب افريقيا" ,"زامبيا" ,"زيمبابوي"]; return country[Math.floor(Math.random() * country.length)]})()'
	},
	'Cyrillic': {
		firstName: '(() => {const names = ["Барыс","Иаков","Илья","Николай","Борис","Владимир","Пётр","Андрій","Олександр","Пилип","Анастасия","Ангеліна","Oленa","Ганна","Мария","Наталя","Ольга","Аляксандра","Оксана"];return names[Math.floor(Math.random() * (names.length))]})()',
		lastName: '(() => {const names = ["Абрамов","Антонов","Боровков","Балакин","Варенников","Веселов","Воскресенский","Веденин","Захаев","Завражный","Звягин","Круков","Караулов","Кузьмич","Качусов","Лебедев","Логиновский","Лялюшкин","Ляпин"];return names[Math.floor(Math.random() * (names.length))]})()',
		lorem: "(() => {const words = ['Когда', 'мне', 'было', '15', 'лет', ',', 'и', 'я', 'ходил', 'срать', 'бятя', 'всё', 'время', 'как-бы', 'невзначай', 'крутился', 'возле', 'толчка', 'спрашивал', 'что', 'ты', 'там', 'затих'];const result = [];for (var j = 0; j < Math.floor(Math.random() * 300); j++) {  result.push(words[Math.floor(Math.random() * words.length)]) }return result.join(', ')})()",
		fullAddress: "(() => {var streetNumber = ['25489', '87459', '35478', '15975', '95125', '78965'] var streetName = ['A street', 'B street', 'C street', 'D street', 'E street', 'F street',] var cityName = ['Riyadh', 'Dammam', 'Jedda', 'Tabouk', 'Makka', 'Maddena', 'Haiel'] var stateName = ['Qassem State', 'North State', 'East State', 'South State', 'West State'] var zipCode = ['28889', '96459', '35748', '15005', '99625', '71465'] function getRandom(input) { return input[Math.floor((Math.random() * input.length))]; }; return `${getRandom(streetNumber)} ${getRandom(streetName)} ${getRandom(cityName)} ${getRandom(stateName)} ${getRandom(zipCode)}`;})()",
		city: '(() => {const names = ["Абаза", "Абакан", "Абдулино", "Абинск", "Агидель", "Агрыз", "Адыгейск", "Азнакаево", "Азов", "Ак-Довурак", "Аксай", "Алагир", "Алапаевск", "Алатырь", "Алдан", "Алейск", "Александров", "Александровск-Сахалинский", "Александровск", "Алексеевка", "Алексин", "Алзамай", "Алупка", "Алушта", "Альметьевск", "Амурск", "Анадырь", "Анапа", "Ангарск", "Андреаполь", "Анжеро-Судженск", "Анива", "Апатиты", "Апрелевка", "Апшеронск", "Арамиль", "Аргун", "Ардатов", "Ардон", "Арзамас", "Аркадак", "Армавир", "Армянск", "Арсеньев", "Арск", "Артём", "Артёмовск", "Артёмовский", "Архангельск", "Асбест", "Асино", "Астрахань", "Аткарск", "Ахтубинск", "Ачинск", "Ачхой-Мартан", "Аша", "Бабаево", "Бабушкин", "Бавлы", "Багратионовск", "Байкальск", "Баймак", "Бакал", "Баксан", "Балабаново", "Балаклава", "Балаково", "Балахна", "Балашиха", "Балашов", "Балей", "Балтийск", "Барабинск", "Барнаул", "Барыш", "Батайск", "Бахчисарай", "Бежецк", "Белая Калитва", "Белая Холуница", "Белгород", "Белебей", "Белинский", "Белово", "Белогорск", "Белогорск", "Белозерск", "Белокуриха", "Беломорск", "Белоозёрский", "Белорецк", "Белореченск", "Белоусово", "Белоярский", "Белый", "Белёв", "Бердск", "Березники", "Берёзовский", "Берёзовский", "Беслан", "Бийск", "Бикин", "Билибино", "Биробиджан", "Бирск", "Бирюсинск", "Бирюч", "Благовещенск", "Благовещенск", "Благодарный", "Бобров", "Богданович", "Богородицк", "Богородск", "Боготол"];return names[Math.floor(Math.random() * (names.length))]})()',
		street: '(() => {const names = ["Arlington Avenue", "Andover Court", "Windsor Drive", "Atlantic Avenue", "Cottage Street", "Arlington Avenue", "Charles Street", "Grand Avenue", "Ann Street", "Main Street", "Jefferson Avenue", "Boulevard Albert Einstein", "Rue Roland Garros"];return names[Math.floor(Math.random() * (names.length))]})()',
		country : '(() => {const country = ["Афганистан","Аландские острова","Албания","Алжир","американское Самоа","Андорра","Ангола","Ангилья","Антарктида","Антигуа и Барбуда","Аргентина","Армения","Аруба","Австралия","Австрия","Азербайджан","Багамы","Бахрейн","Бангладеш","Барбадос","Беларусь","Бельгия","Белиз","Бенин","Бермуды","Бутан","Боливия","Бонэйр, Синт-Эстатиус и Саба","Босния и Герцеговина","Ботсвана","Остров Буве","Бразилия","Британская территория Индийского океана","Бруней-Даруссалам","Болгария","Буркина-Фасо","Бурунди","Камбоджа","Камерун","Канада","Кабо-Верде","Каймановы острова","Центрально-Африканская Республика","Чад","Чили","Китай","Остров Рождества","Кокосовые (Килинг) острова","Колумбия","Коморские острова","Конго","Конго, Демократическая Республика Конго","Острова Кука","Коста-Рика","Берег Слоновой Кости","Хорватия","Куба","Кюрасао","Кипр","Чехия","Дания","Джибути","Доминика","Доминиканская Республика","Эквадор","Египет","Эль Сальвадор","Экваториальная Гвинея","Эритрея","Эстония","Эфиопия","Фолклендские (Мальвинские) острова","Фарерские острова","Фиджи","Финляндия","Франция","Французская Гвиана","Французская Полинезия","Южные Французские Территории","Габон","Гамбия","Грузия","Германия","Гана","Гибралтар","Греция","Гренландия","Гренада","Гваделупа","Гуам","Гватемала","Гернси","Гвинея","Гвинея-Бисау","Гайана","Гаити","Остров Херд и острова Макдональд","Святой Престол (государство-город Ватикан)","Гондурас","Гонконг","Венгрия","Исландия","Индия","Индонезия","Иран, Исламская Республика","Ирак","Ирландия","Остров Мэн","Израиль","Италия","Ямайка","Япония","Джерси","Иордания","Казахстан","Кения","Кирибати","Корея, Народно-Демократическая Республика","Корея, Республика","Косово","Кувейт","Кыргызстан","Лаосская Народно-Демократическая Республика","Латвия","Ливан","Лесото","Либерия","Ливийская арабская джамахирия","Лихтенштейн","Литва","Люксембург","Макао","Македония, бывшая югославская Республика","Мадагаскар","Малави","Малайзия","Мальдивы","Мали","Мальта","Маршалловы острова","Мартиника","Мавритания","Маврикий","Майотта","Мексика","Микронезия, Федеративные Штаты","Молдова, Республика","Монако","Монголия","Черногория","Монтсеррат","Марокко","Мозамбик","Мьянма","Намибия","Науру","Непал","Нидерланды","Нидерландские Антильские острова","Новая Каледония","Новая Зеландия","Никарагуа","Нигер","Нигерия","Ниуэ","Остров Норфолк","Северные Марианские острова","Норвегия","Оман","Пакистан","Палау","Палестинская территория, оккупированная","Панама","Папуа - Новая Гвинея","Парагвай","Перу","Филиппины","Питкэрн","Польша","Португалия","Пуэрто-Рико","Катар","Воссоединение","Румыния","Российская Федерация","Руанда","Сен-Бартелеми","Святой Елены","Сент-Китс и Невис","Сент-Люсия","Сен-Мартен","Сен-Пьер и Микелон","Святой Винсент и Гренадины","Самоа","Сан-Марино","Сан-Томе и Принсипи","Саудовская Аравия","Сенегал","Сербия","Сербия и Черногория","Сейшельские острова","Сьерра-Леоне","Сингапур","Сен-Мартен","Словакия","Словения","Соломоновы острова","Сомали","Южная Африка","Южная Георгия и Южные Сандвичевы острова","южный Судан","Испания","Шри-Ланка","Судан","Суринам","Шпицберген и Ян Майен","Свазиленд","Швеция","Швейцария","Сирийская Арабская Республика","Тайвань, провинция Китая","Таджикистан","Танзания, Объединенная Республика","Таиланд","Тимор-Лешти","Идти","Токелау","Тонга","Тринидад и Тобаго","Тунис","индюк","Туркменистан","Острова Теркс и Кайкос","Тувалу","Уганда","Украина","Объединенные Арабские Эмираты","объединенное Королевство","Соединенные Штаты","Внешние малые острова США","Уругвай","Узбекистан","Вануату","Венесуэла","Вьетнам","Виргинские острова, Британские","Виргинские острова, США","Уоллис и Футуна","Западная Сахара","Йемен","Замбия","Зимбабве"]; return country[Math.floor(Math.random() * country.length)]})()'
	},
	'Chinese': {
		firstName: '(() => {const names = ["愛國","擺","波","博文","張","趙","陳","鄭","志成","家豪","志明","爱","蔼","安","安納","安旎","宝","苞","碧"];return names[Math.floor(Math.random() * (names.length))]})()',
		lastName: '(() => {const names = ["白", "陳", "崔", "徐", "秦", "錢", "程", "蔡", "曹", "戴", "鄧", "丁", "董", "段", "范", "方", "傅", "馮", "賈", "金", "姜", "江", "高", "顧", "龔", "夏", "許", "向", "何", "康", "孔", "任", "邱", "易", "閻", "葉"];return names[Math.floor(Math.random() * (names.length))]})()',
		lorem: '(() => {const words = ["的", "了", "在", "是", "和", "一", "这", "有", "他", "我", "也", "不", "就", "地", "着", "中", "上", "说", "都", "人", "个", "对", "种", "把", "为", "要", "你", "而", "来", "我们", "又", "一个", "与", "从", "年", "到", "还", "它", "大", "等", "她", "两", "去", "没有"];const result = [];for (var j = 0; j < Math.floor(Math.random() * 300); j++) {  result.push(words[Math.floor(Math.random() * words.length)]) }return result.join(", ")})()',
		fullAddress: "(() => {var streetNumber = ['25489', '87459', '35478', '15975', '95125', '78965'] var streetName = ['A street', 'B street', 'C street', 'D street', 'E street', 'F street',] var cityName = ['Riyadh', 'Dammam', 'Jedda', 'Tabouk', 'Makka', 'Maddena', 'Haiel'] var stateName = ['Qassem State', 'North State', 'East State', 'South State', 'West State'] var zipCode = ['28889', '96459', '35748', '15005', '99625', '71465'] function getRandom(input) { return input[Math.floor((Math.random() * input.length))]; }; return `${getRandom(streetNumber)} ${getRandom(streetName)} ${getRandom(cityName)} ${getRandom(stateName)} ${getRandom(zipCode)}`;})()",
		city: '(() => {const names = ["东城区", "西城区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云县", "延庆县", "和平区", "河东区", "河西区", "南开区", "河北区", "红桥区", "东丽区", "西青区", "津南区", "北辰区", "武清区", "宝坻区", "滨海新区", "宁河县", "静海县", "蓟县", "石家庄市", "唐山市", "秦皇岛市", "邯郸市", "邢台市", "保定市", "张家口市", "承德市", "沧州市"];return names[Math.floor(Math.random() * (names.length))]})()',
		street: '(() => {const names = ["Arlington Avenue", "Andover Court", "Windsor Drive", "Atlantic Avenue", "Cottage Street", "Arlington Avenue", "Charles Street", "Grand Avenue", "Ann Street", "Main Street", "Jefferson Avenue", "Boulevard Albert Einstein", "Rue Roland Garros"];return names[Math.floor(Math.random() * (names.length))]})()',
		country : '(() => {const country = ["阿富汗", "阿尔巴尼亚", "阿尔及利亚", "安道尔", "安哥拉", "安提瓜和巴布达", "阿根廷", "亚美尼亚", "澳大利亚", "奥地利", "阿塞拜疆", "巴哈马", "巴林", "孟加拉国", "巴巴多斯", "白俄罗斯", "比利时", "伯利兹", "贝宁", "不丹", "玻利维亚", "波黑", "博茨瓦纳", "巴西", "文莱", "保加利亚", "布基纳法索", "布隆迪", "柬埔寨", "喀麦隆", "加拿大", "佛得角", "中非", "乍得", "智利", "中国", "哥伦比亚", "科摩罗", "刚果共和国", "刚果民主共和国", "哥斯达黎加", "科特迪瓦", "克罗地亚", "古巴", "塞浦路斯", "捷克", "丹麦", "吉布提", "多米尼克", "多米尼加", "厄瓜多尔", "埃及", "萨尔瓦多", "赤道几内亚", "厄立特里亚", "爱沙尼亚", "埃塞俄比亚", "斐济", "芬兰", "法国", "加蓬", "冈比亚", "格鲁吉亚", "德国", "加纳", "希腊", "格林纳达", "危地马拉", "几内亚", "几内亚比绍", "圭亚那", "海地", "洪都拉斯", "匈牙利", "冰岛", "印度", "印度尼西亚", "伊朗", "伊拉克", "爱尔兰", "以色列", "意大利", "牙买加", "日本", "约旦", "哈萨克斯坦", "肯尼亚", "基里巴斯", "朝鲜", "韩国", "科威特", "吉尔吉斯斯坦", "老挝", "拉脱维亚", "黎巴嫩", "莱索托", "利比里亚", "利比亚", "列支敦士登", "立陶宛", "卢森堡", "北马其顿", "马达加斯加", "马拉维", "马来西亚", "马尔代夫", "马里", "马耳他", "马绍尔群岛", "毛里塔尼亚", "毛里求斯", "墨西哥", "密克罗尼西亚联邦", "摩洛哥", "摩尔多瓦", "摩纳哥", "蒙古", "黑山", "莫桑比克", "缅甸", "纳米比亚", "瑙鲁", "尼泊尔", "荷兰", "新西兰", "尼加拉瓜", "尼日尔", "尼日利亚", "挪威", "阿曼", "巴基斯坦", "帕劳", "巴拿马", "巴布亚新几内亚", "巴拉圭", "秘鲁", "菲律宾", "波兰", "葡萄牙", "卡塔尔", "罗马尼亚", "俄罗斯", "卢旺达", "圣基茨和尼维斯", "圣卢西亚", "圣文森特和格林纳丁斯", "萨摩亚", "圣马力诺", "圣多美和普林西比", "沙特阿拉伯", "塞内加尔", "塞尔维亚", "塞舌尔", "塞拉利昂", "新加坡", "斯洛伐克", "斯洛文尼亚", "所罗门群岛", "索马里", "南非", "南苏丹", "西班牙", "斯里兰卡", "苏丹", "苏里南", "斯威士兰", "瑞典", "瑞士", "叙利亚", "塔吉克斯坦", "坦桑尼亚", "泰国", "东帝汶", "多哥", "汤加", "特立尼达和多巴哥", "突尼斯", "土耳其", "土库曼斯坦", "图瓦卢", "乌干达", "乌克兰", "阿联酋", "英国", "美国", "乌拉圭", "乌兹别克斯坦", "瓦努阿图", "委内瑞拉", "越南", "也门", "赞比亚", "津巴布韦"]; return country[Math.floor(Math.random() * country.length)]})()'
	},
	'Japanese': {
		firstName: '(() => {const names = ["蓮","陽翔","湊","悠真","蒼","樹","大翔","颯","大和","湊斗","碧","陽葵","芽依","陽菜","結愛","結菜","さくら","あかり","葵", "紬", "莉子"];return names[Math.floor(Math.random() * (names.length))]})()',
		lastName: '(() => {const names = ["佐藤","鈴木","高橋","田中","渡辺","伊藤","中村","小林","山本","加藤","吉田","山田","佐々木","山口","松本","井上","木村","清水","林"];return names[Math.floor(Math.random() * (names.length))]})()',
		lorem: '(() => {const words = ["阿", "以", "鵜", "絵", "尾", "課", "樹", "区", "毛", "個", "差", "氏", "巣", "瀬", "素", "他", "知", "津", "手", "都", "名", "二", "擢", "根", "野", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "ん", "っ", "ゃ", "ょ", "ゅ", "タ", "チ", "ツ", "テ", "ト"];const result = [];for (var j = 0; j < Math.floor(Math.random() * 300); j++) {  result.push(words[Math.floor(Math.random() * words.length)]) }return result.join(", ")})()',
		fullAddress: "(() => {var streetNumber = ['25489', '87459', '35478', '15975', '95125', '78965'] var streetName = ['A street', 'B street', 'C street', 'D street', 'E street', 'F street',] var cityName = ['Riyadh', 'Dammam', 'Jedda', 'Tabouk', 'Makka', 'Maddena', 'Haiel'] var stateName = ['Qassem State', 'North State', 'East State', 'South State', 'West State'] var zipCode = ['28889', '96459', '35748', '15005', '99625', '71465'] function getRandom(input) { return input[Math.floor((Math.random() * input.length))]; }; return `${getRandom(streetNumber)} ${getRandom(streetName)} ${getRandom(cityName)} ${getRandom(stateName)} ${getRandom(zipCode)}`;})()",
		city: '(() => {const names = ["能代市", "横手市", "大館市", "男鹿市", "湯沢市", "鹿角市", "由利本荘市", "潟上市", "大仙市", "北秋田市", "にかほ市", "仙北市", "小坂町", "上小阿仁村", "藤里町", "三種町", "八峰町", "五城目町", "八郎潟町", "井川町", "大潟村", "美郷町", "羽後町", "東成瀬村", "山形市", "米沢市", "鶴岡市", "酒田市", "新庄市", "寒河江市", "上山市", "村山市", "長井市", "天童市", "東根市", "尾花沢市", "南陽市", "山辺町", "中山町", "河北町", "西川町", "朝日町", "大江町", "大石田町", "金山町", "最上町", "舟形町", "真室川町", "大蔵村", "鮭川村", "戸沢村", "高畠町", "川西町", "小国町", "白鷹町", "飯豊町", "三川町", "庄内町", "遊佐町", "福島市"];return names[Math.floor(Math.random() * (names.length))]})()',
		street: '(() => {const names = ["Arlington Avenue", "Andover Court", "Windsor Drive", "Atlantic Avenue", "Cottage Street", "Arlington Avenue", "Charles Street", "Grand Avenue", "Ann Street", "Main Street", "Jefferson Avenue", "Boulevard Albert Einstein", "Rue Roland Garros"];return names[Math.floor(Math.random() * (names.length))]})()',
		country : '(() => {const country = ["アフガニスタン","オーランド諸島","アルバニア","アルジェリア","アメリカ領サモア","アンドラ","アンゴラ","アンギラ","南極大陸","アンティグアバーブーダ","アルゼンチン","アルメニア","アルバ","オーストラリア","オーストリア","アゼルバイジャン","バハマ","バーレーン","バングラデシュ","バルバドス","ベラルーシ","ベルギー","ベリーズ","ベナン","バミューダ","ブータン","ボリビア","ボネール、シントユースタティウス、サバ","ボスニア・ヘルツェゴビナ","ボツワナ","ブーベ島","ブラジル","イギリス領インド洋地域","ブルネイダルサラーム","ブルガリア","ブルキナファソ","ブルンジ","カンボジア","カメルーン","カナダ","カーボベルデ","ケイマン諸島","中央アフリカ共和国","チャド","チリ","中国","クリスマス島","ココス（キーリング）諸島","コロンビア","コモロ","コンゴ","コンゴ、コンゴ民主共和国","クック諸島","コスタリカ","コートジボワール","クロアチア","キューバ","キュラソー","キプロス","チェコ共和国","デンマーク","ジブチ","ドミニカ","ドミニカ共和国","エクアドル","エジプト","エルサルバドル","赤道ギニア","エリトリア","エストニア","エチオピア","フォークランド諸島（マルビナス）","フェロー諸島","フィジー","フィンランド","フランス","フランス領ギアナ","フランス領ポリネシア","フランス領南方南方領土","ガボン","ガンビア","ジョージア","ドイツ","ガーナ","ジブラルタル","ギリシャ","グリーンランド","グレナダ","グアドループ","グアム","グアテマラ","ガーンジー","ギニア","ギニアビサウ","ガイアナ","ハイチ","ハード島とマクドナルド諸島","ホーリーシー（バチカン市国）","ホンジュラス","香港","ハンガリー","アイスランド","インド","インドネシア","イラン、イスラム共和国","イラク","アイルランド","マン島","イスラエル","イタリア","ジャマイカ","日本","ジャージー","ヨルダン","カザフスタン","ケニア","キリバス","韓国、朝鮮民主主義人民共和国","大韓民国","コソボ","クウェート","キルギスタン","ラオス人民民主共和国","ラトビア","レバノン","レソト","リベリア","リビアアラブジャマヒリヤ","リヒテンシュタイン","リトアニア","ルクセンブルク","マカオ","マケドニア、旧ユーゴスラビア共和国","マダガスカル","マラウイ","マレーシア","モルディブ","マリ","マルタ","マーシャル諸島","マルティニーク","モーリタニア","モーリシャス","マヨット","メキシコ","ミクロネシア連邦","モルドバ共和国","モナコ","モンゴル","モンテネグロ","モントセラト","モロッコ","モザンビーク","ミャンマー","ナミビア","ナウル","ネパール","オランダ","オランダ領アンティル","ニューカレドニア","ニュージーランド","ニカラグア","ニジェール","ナイジェリア","ニウエ","ノーフォーク島","北マリアナ諸島","ノルウェー","オマーン","パキスタン","パラオ","パレスチナ自治区、占領下","パナマ","パプアニューギニア","パラグアイ","ペルー","フィリピン","ピトケアン","ポーランド","ポルトガル","プエルトリコ","カタール","再会","ルーマニア","ロシア連邦","ルワンダ","サンバルテルミー","セントヘレナ","セントクリストファーネイビス","セントルシア","サンマルタン","サンピエール島とミクロン島","セントビンセントおよびグレナディーン諸島","サモア","サンマリノ","サントメ・プリンシペ","サウジアラビア","セネガル","セルビア","セルビアとモンテネグロ","セイシェル","シエラレオネ","シンガポール","セントマーチン","スロバキア","スロベニア","ソロモン諸島","ソマリア","南アフリカ","サウスジョージア島とサウスサンドイッチ諸島","南スーダン","スペイン","スリランカ","スーダン","スリナム","スバールバル諸島およびヤンマイエン","スワジランド","スウェーデン","スイス","シリアアラブ共和国","台湾、中国省","タジキスタン","タンザニア、連合共和国","タイ","東ティモール","トーゴ","トケラウ","トンガ","トリニダード・トバゴ","チュニジア","七面鳥","トルクメニスタン","タークス・カイコス諸島","ツバル","ウガンダ","ウクライナ","アラブ首長国連邦","イギリス","アメリカ","合衆国領有小島","ウルグアイ","ウズベキスタン","バヌアツ","ベネズエラ","ベトナム","英領バージン諸島","アメリカ領バージン諸島","ウォリス・フツナ","西サハラ","イエメン","ザンビア","ジンバブエ"]; return country[Math.floor(Math.random() * country.length)]})()'
	},
}

export class Generator {

	configuration: Configuration = new Configuration();
	dictionary!: string

	constructor() {
		this.dictionary = this.configuration.getByName('preferredDictionary')?.value;
	}

	getGroups(): Group[] {
		return [
			{
				name: 'ID',
				values: [
					{
						name: "UUID",
						type: [TypeName.String],
						fct: "(() => {return crypto.randomUUID()})()"
					},
					{
						name: "ObjectID",
						type: [TypeName.String],
						fct: "(() => {return Math.floor(new Date().getTime() / 1000).toString(16) + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16) ).toLowerCase();})()"
					}
				],
			}, {
				name: 'Primitive',
				values: [
					{
						name: "True / False",
						type: [TypeName.Numeric],
						fct: "(() => {return Math.random() < 0.5})()"
					},
					{
						name: "Float(0, 1)",
						type: [TypeName.Numeric],
						fct: "(() => {return Math.random()})()"
					},
					{
						name: "Float(-1000000, 1000000)",
						type: [TypeName.Numeric],
						fct: "((min, max) => {return Math.random() * (max - min) + min})(-1000000, 1000000)"
					},
					{
						name: "Integer(0, 10)",
						type: [TypeName.Numeric],
						fct: "((min, max) => {return Math.floor(Math.random() * (max - min) + min})(0, 10)"
					},
					{
						name: "Integer(-100000, 100000)",
						type: [TypeName.Numeric],
						fct: "((min, max) => {return Math.floor(Math.random() * (max - min) + min)})(-100000, 100000)"
					},
					{
						name: "String(0, 16)",
						type: [TypeName.String],
						fct: "((chars) => {return chars.replace(/[x]/g, () => String.fromCharCode(Math.floor(Math.random() * 65535)))})('xxxxxxxxxxxxxxxx');"
					},
					{
						name: "Null",
						type: [TypeName.Date, TypeName.Numeric, TypeName.Other, TypeName.String],
						fct: "(() => {return null})()"
					}
				],
			}, {
				name: 'Name',
				values: [
					{
						name: "First Name",
						type: [TypeName.String],
						fct: translation[this.dictionary].firstName
					},
					{
						name: "Last Name",
						type: [TypeName.String],
						fct: translation[this.dictionary].lastName
					},
				],
			}, {
				name: 'Email',
				values: [
					{
						name: "Email",
						type: [TypeName.String],
						fct: '(() => {let email = ", "; const chars = "abcdefghijklmnopqrstuvwxyz1234567890."; const domain = ["gmail.com","yahoo.com","aol.com","hotmail.com","ootlook.com","ootlook.fr","orange.fr"]; const length = Math.floor(Math.random() * 20) + 3; for(var ii=0; ii < length; ii++){email += chars[Math.floor(Math.random() * chars.length)];} return email + "@" + domain[Math.floor(Math.random() * domain.length)]})()'
					},
				],
			}, {
				name: 'Password',
				values: [
					{
						name: "SHA1('password')",
						type: [TypeName.String],
						fct: "(() => {return return cryptojs.SHA1('password')})()"
					},
					{
						name: "SHA256('password')",
						type: [TypeName.String],
						fct: "(() => {return cryptojs.SHA256('password')})()"
					},
					{
						name: "SHA256('password', 'salt')",
						type: [TypeName.String],
						fct: "(() => {return cryptojs.SHA256(cryptojs.SHA256('password') + 'salt')})()"
					}
				],
			}, {
				name: 'Date',
				values: [
					{
						name: "Timestamp (in milliseconds)",
						type: [TypeName.Date],
						fct: "(() => {return Math.floor(Math.random() * 1e+12)})()"
					},
					{
						name: "Year-Day-Month",
						type: [TypeName.Date],
						fct: "(() => {return (new Date(+(new Date()) - Math.floor(Math.random() * 1e+12))).toISOString().split('T')[0]})()"
					},
					{
						name: "Year-Day-Month Hour:Minute:Second",
						type: [TypeName.Date],
						fct: "(() => {return (new Date(+(new Date()) - Math.floor(Math.random() * 1e+12))).toISOString()})()"
					},
					{
						name: "Day/Month/Year",
						type: [TypeName.Date],
						fct: "(() => {return (new Date(+(new Date()) - Math.floor(Math.random() * 1e+12))).toLocaleDateString('fr-FR')})()"
					},
					{
						name: "Day/Month/Year Hour:Minute:Second",
						type: [TypeName.Date],
						fct: "(() => {return (new Date(+(new Date()) - Math.floor(Math.random() * 1e+12))).toLocaleString('fr-FR')})()"
					},
					{
						name: "Year",
						type: [TypeName.Numeric],
						fct: "(() => {return Math.floor(Math.random() * 2500) + 1800})()"
					},
					{
						name: "Month",
						type: [TypeName.Numeric],
						fct: "(() => {return Math.floor(Math.random() * 12) + 1})()"
					},
					{
						name: "Day",
						type: [TypeName.Numeric],
						fct: "(() => {return Math.floor(Math.random() * 32) + 1})()"
					},
					{
						name: "Hour",
						type: [TypeName.Numeric],
						fct: "(() => {return Math.floor(Math.random() * 24)})()"
					},
					{
						name: "Minute",
						type: [TypeName.Numeric],
						fct: "(() => {return Math.floor(Math.random() * 60)})()"
					},
					{
						name: "Second",
						type: [TypeName.Numeric],
						fct: "(() => {return Math.floor(Math.random() * 60)})()"
					},
					{
						name: "Millisecond",
						type: [TypeName.Numeric],
						fct: "(() => {return Math.floor(Math.random() * 1000)})()"
					}
				],
			}, {
				name: 'Address',
				values: [
					{
						name: "Full Address",
						type: [TypeName.String],
						fct: translation[this.dictionary].fullAddress
					},
					{
						name: "Street",
						type: [TypeName.String],
						fct: translation[this.dictionary].street
					},
					{
						name: "City",
						type: [TypeName.String],
						fct: translation[this.dictionary].city
					},
					{
						name: "Country",
						type: [TypeName.String],
						fct: translation[this.dictionary].country
					},
					{
						name: "Country Code (XX)",
						type: [TypeName.String],
						fct: '(() => {const country = ["AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ", "SZ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"]; return country[Math.floor(Math.random() * country.length)]})()'
					},
				]
			}, {
				name: 'Phone',
				values: [
					{
						name: "XXX-XXX-XXXX",
						type: [TypeName.String],
						fct: "(() => {return 'XXX-XXX-XXXX'.replace(/[X]/g, () => Math.floor(Math.random() * 10))})()"
					},
					{
						name: "XX.XX.XX.XX.XX",
						type: [TypeName.String],
						fct: "(() => {return 'XX.XX.XX.XX.XX'.replace(/[X]/g, () => Math.floor(Math.random() * 10))})()"
					},
					{
						name: "XXXXXXXXXX",
						type: [TypeName.Numeric],
						fct: "(() => {return 'XXXXXXXXXX'.replace(/[X]/g, () => Math.floor(Math.random() * 10))})()"
					},
					{
						name: "XXXX-XXXX",
						type: [TypeName.String],
						fct: "(() => {return 'XXXX-XXXX'.replace(/[X]/g, () => Math.floor(Math.random() * 10))})()"
					}
				],
			}, {
				name: 'Lorem',
				values: [
					{
						name: "0-300 Words",
						type: [TypeName.String],
						fct: translation[this.dictionary].lorem
					},
				]
			}, {
				name: 'Geolocation',
				values: [
					{
						name: "Latitude | Longitude",
						type: [TypeName.Numeric],
						fct: "(() => {return (Math.random() * (-360) + 180).toFixed(3)})()"
					},
				],
			}
		];
	}
}
