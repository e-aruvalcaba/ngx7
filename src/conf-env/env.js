(function() {
  window.API_HOST = 'https://uscldcnxapmsa01.azure-api.net/';
  window.COUNTLY_KEY = '56cc30d0da706ccb84d642e3275da73543c71768';
  window.ROLLOUT_APP_KEY = '5bb24a54bae7137e6c9de19e';
  window.API_HOST_FULL = '';
  window.API_ORG = '';
  window.API_ENV = '';
  window.ENV = 'not';
  window.APP_CODE = 'Foreman_App';
  window.CLIENT_ID = '';
  window.HOST_EUROPE = 'localhost:4200';
  window.HOST_AMERICA = 'localhost:4200';
  window.SITE_DOMAIN = 'localhost';
  window.COUNTLY_URL = 'https://cemex.count.ly';
  window.SHOW_MAINTENANCE_ALERT = '';
  window.CMX_LOYALTY_PROGRAM_URL = 'https://www.mycemex.cemex.com/';
  window.APPINSIGHTS_INSTRUMENTATIONKEY = '';
  window.BOTCHAT_JS_URL = '';
  window.GOOGLE_MAPS_API_KEY = 'AIzaSyAb0m2qsu5odK1JdmLa0EgFOiEZtn51NhQ';
  //used in translationService, it is necessary to inject
  window.LANGUAGE = 'en_US';
  window.TRANSLATE_URL = 'https://uscldcnxwaadmq01.azurewebsites.net/';
  window.CMX_LANGUAGES = [
    {
      languageId: 0,
      languageName: 'English US',
      languageCountry: 'United States',
      languageISO: 'en_US',
      authorLanguage: null,
      currencySymbol: '$',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'dollar',
      formatDate: 'MMM DD, YYYY',
      formatTime: 'hh:mm A',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'January,February,March,April,May,June,July,August,September,October,November,December',
      dayNames: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      countryCode: 'US',
      shortDayNames: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
      shortDayMonths: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
      shortDayNames2: 'Su,Mo,Tu,We,Th,Fr,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 1,
      languageName: 'Español México',
      languageCountry: 'México',
      languageISO: 'es_MX',
      authorLanguage: null,
      currencySymbol: '$',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'peso',
      formatDate: 'DD MMM, YYYY',
      formatTime: 'hh:mm A',
      decimalSeparator: '.',
      decimalNumbers: 3,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
      countryCode: 'MX',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Seg',
      decimalNumbersMoney: 2
    },
    {
      languageId: 2,
      languageName: 'Español Colombia',
      languageCountry: 'Colombia',
      languageISO: 'es_CO',
      authorLanguage: null,
      currencySymbol: '$',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'peso',
      formatDate: 'DD MMM, YYYY',
      formatTime: 'hh:mm A',
      decimalSeparator: ',',
      decimalNumbers: 3,
      thousandSeparator: '.',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
      countryCode: 'CO',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 0
    },
    {
      languageId: 3,
      languageName: 'Español Costa Rica',
      languageCountry: 'Costa Rica ',
      languageISO: 'es_CR',
      authorLanguage: null,
      currencySymbol: '₡',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'Colon',
      formatDate: 'DD MMM, YYYY',
      formatTime: 'hh:mm ',
      decimalSeparator: '.',
      decimalNumbers: 0,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado ',
      countryCode: 'CR',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'Hrs',
      minutesCode: 'Min',
      secondsCode: 'Seg',
      decimalNumbersMoney: 2
    },
    {
      languageId: 4,
      languageName: 'Español Panamá',
      languageCountry: 'Panamá',
      languageISO: 'es_PA',
      authorLanguage: null,
      currencySymbol: '$',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'Dollar',
      formatDate: 'DD MMM, YYYY',
      formatTime: 'hh:mm',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
      countryCode: 'PA',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'Hrs',
      minutesCode: 'Min',
      secondsCode: 'Seg',
      decimalNumbersMoney: 2
    },
    {
      languageId: 5,
      languageName: 'Español Nicaragua',
      languageCountry: 'Nicaragua',
      languageISO: 'es_NI',
      authorLanguage: null,
      currencySymbol: 'C$',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'Córdoba ',
      formatDate: 'DD MMM, YYYY',
      formatTime: 'hh:mm A',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
      countryCode: 'NI',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'Hrs',
      minutesCode: 'Min',
      secondsCode: 'Seg',
      decimalNumbersMoney: 2
    },
    {
      languageId: 6,
      languageName: 'Español El Salvador',
      languageCountry: 'El Salvador',
      languageISO: 'es_SV',
      authorLanguage: null,
      currencySymbol: '$',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'USD',
      formatDate: 'DD MMM, YYYY',
      formatTime: 'hh:mm',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
      countryCode: 'SV',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'Hrs',
      minutesCode: 'Min',
      secondsCode: 'Seg',
      decimalNumbersMoney: 2
    },
    {
      languageId: 7,
      languageName: 'Español Dominicana',
      languageCountry: 'República Dominicana',
      languageISO: 'es_DO',
      authorLanguage: null,
      currencySymbol: 'RD$',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'Peso Dominicano',
      formatDate: 'DD.MM.YYYY',
      formatTime: 'hh:mm',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
      countryCode: 'DO',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 8,
      languageName: 'Español Guatemala',
      languageCountry: 'Guatemala',
      languageISO: 'es_GT',
      authorLanguage: null,
      currencySymbol: 'Q.',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'Quetzal',
      formatDate: 'DD.MM.YYYY',
      formatTime: 'HH:mm',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
      countryCode: 'GT',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 9,
      languageName: 'Español Puerto Rico',
      languageCountry: 'Puerto Rico',
      languageISO: 'es_PR',
      authorLanguage: null,
      currencySymbol: '$',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'Dollar',
      formatDate: 'DD.MM.YYYY',
      formatTime: 'hh:mm A',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
      countryCode: 'PR',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 10,
      languageName: 'English Puerto Rico',
      languageCountry: 'Puerto Rico',
      languageISO: 'en_PR',
      authorLanguage: null,
      currencySymbol: '$',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'Dollar',
      formatDate: 'DD.MM.YYYY',
      formatTime: 'hh:mm A',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'January,Februrary,March,April,May,June,July,August,September,October,November,December',
      dayNames: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      countryCode: 'PR',
      shortDayNames: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
      shortDayMonths: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
      shortDayNames2: 'Su,Mo,Tu,We,Th,Fr,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 11,
      languageName: 'Español Perú',
      languageCountry: 'Perú',
      languageISO: 'es_PE',
      authorLanguage: null,
      currencySymbol: 'S/',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'Soles peruanos',
      formatDate: 'DD/MM/YYYY',
      formatTime: 'hh:mm',
      decimalSeparator: ',',
      decimalNumbers: 0,
      thousandSeparator: '.',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
      countryCode: 'PE',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 12,
      languageName: 'English UK',
      languageCountry: 'United Kingdom',
      languageISO: 'en_GB',
      authorLanguage: null,
      currencySymbol: '£',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'pound sterling',
      formatDate: 'DD/MM/YYYY',
      formatTime: 'hh:mm A',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'January,February,March,April,May,June,July,August,September,October,November,December',
      dayNames: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      countryCode: 'GB',
      shortDayNames: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
      shortDayMonths: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
      shortDayNames2: 'Su,Mo,Tu,We,Th,Fr,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 13,
      languageName: 'Français',
      languageCountry: 'France',
      languageISO: 'fr_FR',
      authorLanguage: null,
      currencySymbol: '€',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Right',
      currencyName: 'Euro',
      formatDate: 'DD.MM.YYYY',
      formatTime: 'HH:mm',
      decimalSeparator: ',',
      decimalNumbers: 2,
      thousandSeparator: ' ',
      textFloat: 'left',
      monthNames: 'Janvier,Février,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre',
      dayNames: 'Dimanche,Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
      countryCode: 'FR',
      shortDayNames: 'Dim,Lun,Mar,Mer,Jeu,Ven,Sam',
      shortDayMonths: 'Jan,Fév,Mar,Avr,Mai,Jun,Jui,Aou,Sep,Oct,Nov,Déc',
      shortDayNames2: 'Di,Lu,Ma,Me,Je,Ve,Sa',
      hoursCode: 'H',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 14,
      languageName: 'Deutsch',
      languageCountry: 'Deutschland',
      languageISO: 'de_DE',
      authorLanguage: null,
      currencySymbol: '€',
      currencyFormat: '%n%u',
      currencySymbolFloat: 'Right',
      currencyName: 'Euro',
      formatDate: 'DD.MM.YYYY',
      formatTime: 'HH:mm',
      decimalSeparator: ',',
      decimalNumbers: 2,
      thousandSeparator: '.',
      textFloat: 'left',
      monthNames: 'Januar,Februar,März,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember',
      dayNames: 'Sonntag,Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag',
      countryCode: 'DE',
      shortDayNames: 'Son,Mon,Die,Mit,Don,Fre,Sam',
      shortDayMonths: 'Jӓn,Feb,Mӓr,Apr,Mai,Jun,Jul,Aug,Sep,Okt,Nov,Dez',
      shortDayNames2: 'So,Mo,Di,Mi,Do,Fr,Sa',
      hoursCode: 'Std',
      minutesCode: 'Min',
      secondsCode: 'S',
      decimalNumbersMoney: 2
    },
    {
      languageId: 15,
      languageName: 'עברית',
      languageCountry: 'Israel',
      languageISO: 'he_IL',
      authorLanguage: null,
      currencySymbol: '₪',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'Shekel',
      formatDate: 'DD/MM/YYYY',
      formatTime: 'HH:mm',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'right',
      monthNames: 'ינואר,פברואר,מרץ,אפריל,מאי,יוני,יולי,אוגוסט,ספטמבר,אוקטובר,נובמבר,דצמבר',
      dayNames: 'ראשון,שני,שלישי,רביעי,חמישי,שישי,שבת',
      countryCode: 'IL',
      shortDayNames: 'ראש,שני,שלי,רבי,חמי,שיש,שבת',
      shortDayMonths: 'ינו,פבר,מרץ,אפר,מאי,יונ,יול,אוג,ספט,אוק,נוב,דצמ',
      shortDayNames2: "א',ב',ג',ד',ה',ו',שב",
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 16,
      languageName: 'Polski',
      languageCountry: 'Polska',
      languageISO: 'pl_PL',
      authorLanguage: null,
      currencySymbol: 'zł',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Right',
      currencyName: 'Złoty',
      formatDate: 'D-MM-YYYY',
      formatTime: 'HH:mm',
      decimalSeparator: ',',
      decimalNumbers: 2,
      thousandSeparator: ' ',
      textFloat: 'left',
      monthNames: 'Styczeń,Luty,Marzec,Kwiecień,Maj,Czerwiec,Lipiec,Sierpień,Wrzesień,Październik,Listopad,Grudzień',
      dayNames: 'Niedziela,Poniedziałek,Wtorek,Środa,Czwartek,Piątek,Sobota',
      countryCode: 'PL',
      shortDayNames: 'ndz.,pn.,wt.,śr.,czw.,pt.,sob.',
      shortDayMonths: 'st.,lut.,mrz.,kw.,maj,cz.,lip.,sier.,wrz.',
      shortDayNames2: 'nd,pn,wt,śr,cz,pt,sb',
      hoursCode: 'godz',
      minutesCode: 'min',
      secondsCode: 'sek',
      decimalNumbersMoney: 2
    },
    {
      languageId: 17,
      languageName: 'Español España',
      languageCountry: 'España',
      languageISO: 'es_ES',
      authorLanguage: null,
      currencySymbol: '€',
      currencyFormat: '%n%u',
      currencySymbolFloat: 'Right',
      currencyName: 'Euro',
      formatDate: 'DD.MM.YYYY',
      formatTime: 'HH:mm',
      decimalSeparator: ',',
      decimalNumbers: 2,
      thousandSeparator: '.',
      textFloat: 'left',
      monthNames: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
      dayNames: 'Domingo,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
      countryCode: 'ES',
      shortDayNames: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
      shortDayMonths: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
      shortDayNames2: 'Do,Lu,Ma,Mi,Ju,Vi,Sa',
      hoursCode: 'h',
      minutesCode: 'min',
      secondsCode: 'Seg',
      decimalNumbersMoney: 2
    },
    {
      languageId: 18,
      languageName: 'English Philippines',
      languageCountry: 'Philippines',
      languageISO: 'en_PH',
      authorLanguage: null,
      currencySymbol: ' ₱',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Left',
      currencyName: 'Peso',
      formatDate: 'MM/DD/YYYY',
      formatTime: 'hh:mm A',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'January,February,March,April,May,June,July,August,September,October,November,December',
      dayNames: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      countryCode: 'PH',
      shortDayNames: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
      shortDayMonths: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
      shortDayNames2: 'Su,Mo,Tu,We,Th,Fr,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 19,
      languageName: 'Čeština',
      languageCountry: 'Česká republika',
      languageISO: 'cs_CZ',
      authorLanguage: null,
      currencySymbol: ' Kč',
      currencyFormat: '%n%u',
      currencySymbolFloat: 'Right',
      currencyName: 'Koruna',
      formatDate: 'DD.MM.YYYY',
      formatTime: 'HH:mm',
      decimalSeparator: ',',
      decimalNumbers: 2,
      thousandSeparator: ' ',
      textFloat: 'left',
      monthNames: 'Leden,Únor,Březen,Duben,Květen,Červen,Červenec,Srpen,Září,Říjen,Listopad,Prosinec',
      dayNames: 'Pondělí,Úterý,Středa,Čtvrtek,Pátek,Sobota,Neděle',
      countryCode: 'CZ',
      shortDayNames: 'Ned,Pon,Úte,Stř,Čtv,Pát,Sob',
      shortDayMonths: 'Led,Úno,Bře,Dub,Kvě,Čvn,Čvc,Srp,Zář,Říj,Lis,Pro',
      shortDayNames2: 'Ne,Po,Út,St,Čt,Pá,So',
      hoursCode: 'h',
      minutesCode: 'min',
      secondsCode: 'sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 20,
      languageName: 'العربيه – مصر',
      languageCountry: 'جمهورية مصر العربية',
      languageISO: 'ar_EG',
      authorLanguage: null,
      currencySymbol: 'ج.م',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Right',
      currencyName: 'جنيه مصرى‎ ',
      formatDate: 'YY/MM/DD',
      formatTime: 'hh:mm a',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'right',
      monthNames: 'يناير,فبراير,مارس,أبريل,مايو,يونيو,يوليو,أغسطس,سبتمبر,أكتوبر,نوفمبر,ديسمبر',
      dayNames: 'السبت,الأحد,الأثنين,الثلاثاء,الأربعاء,الخميس,الجمعه',
      countryCode: 'EG',
      shortDayNames: 'السبت,الأحد,الأثنين,الثلاثاء,الأربعاء,الخميس,الجمعه',
      shortDayMonths: 'يناير,فبراير,مارس,أبريل,مايو,يونيو,يوليو,أغسطس,سبتمبر,أكتوبر,نوفمبر,ديسمبر',
      shortDayNames2: 'السبت,الأحد,الأثنين,الثلاثاء,الأربعاء,الخميس,الجمعه',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 21,
      languageName: 'العربية - الأمارات',
      languageCountry: 'الأمارات العربية المتحدة',
      languageISO: 'ar_AE',
      authorLanguage: null,
      currencySymbol: 'د.أ',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Right',
      currencyName: 'درهم اماراتي',
      formatDate: 'DD/MM/YY',
      formatTime: 'hh:mm A',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'right',
      monthNames: 'يناير,فبراير,مارس,أبريل,مايو,يونيو,يوليو,أغسطس,سبتمبر,أكتوبر,نوفمبر,ديسمبر',
      dayNames: 'الأحد,الإثنين,الثلاثاء,الأربعاء,الخميس,الجمعة,السبت',
      countryCode: 'AE',
      shortDayNames: 'الأحد,الإثنين,الثلاثاء,الأربعاء,الخميس,الجمعة,السبت',
      shortDayMonths: 'يناير,فبراير,مارس,أبريل,مايو,يونيو,يوليو,أغسطس,سبتمبر,أكتوبر,نوفمبر,ديسمبر',
      shortDayNames2: 'الأحد,الإثنين,الثلاثاء,الأربعاء,الخميس,الجمعة,السبت',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 22,
      languageName: 'English UAE',
      languageCountry: 'United Arab Emirates',
      languageISO: 'en_AE',
      authorLanguage: null,
      currencySymbol: 'AED',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Right',
      currencyName: 'Dirham',
      formatDate: 'DD/MM/YY',
      formatTime: 'hh:mm A',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'January,February,March,April,May,June,July,August,September,October,November,December',
      dayNames: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      countryCode: 'AE',
      shortDayNames: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
      shortDayMonths: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
      shortDayNames2: 'Su,Mo,Tu,We,Th,Fr,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    },
    {
      languageId: 23,
      languageName: 'English EG',
      languageCountry: 'Egypt',
      languageISO: 'en_EG',
      authorLanguage: null,
      currencySymbol: 'L.E.',
      currencyFormat: '%u%n',
      currencySymbolFloat: 'Right',
      currencyName: 'EGP',
      formatDate: 'DD/MM/YY',
      formatTime: 'hh:mm a',
      decimalSeparator: '.',
      decimalNumbers: 2,
      thousandSeparator: ',',
      textFloat: 'left',
      monthNames: 'January,February,March,April,May,June,July,August,September,October,November,December',
      dayNames: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      countryCode: 'EG',
      shortDayNames: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
      shortDayMonths: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
      shortDayNames2: 'Su,Mo,Tu,We,Th,Fr,Sa',
      hoursCode: 'Hr',
      minutesCode: 'Min',
      secondsCode: 'Sec',
      decimalNumbersMoney: 2
    }
  ];
})();
