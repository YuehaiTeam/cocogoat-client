/* eslint-disable prefer-regex-literals */
/* gettext.js - Guillaume Potier - MIT Licensed */
const i18n = function (options = {}) {
    // default values that could be overriden in i18n() construct
    let defaults = {
        domain: 'messages',
        locale: (typeof document !== 'undefined' ? document.documentElement.getAttribute('lang') : false) || 'en',
        plural_func: function (n) {
            return { nplurals: 2, plural: n !== 1 ? 1 : 0 }
        },
        ctxt_delimiter: String.fromCharCode(4), // \u0004
    }

    // handy mixins taken from underscode.js
    let _ = {
        isObject: function (obj) {
            let type = typeof obj
            return type === 'function' || (type === 'object' && !!obj)
        },
        isArray: function (obj) {
            return toString.call(obj) === '[object Array]'
        },
    }

    let _locale = options.locale || defaults.locale
    let _domain = options.domain || defaults.domain
    let _dictionary = {}
    let _plural_forms = {}
    let _ctxt_delimiter = options.ctxt_delimiter || defaults.ctxt_delimiter

    if (options.messages) {
        _dictionary[_domain] = {}
        _dictionary[_domain][_locale] = options.messages
    }

    if (options.plural_forms) {
        _plural_forms[_locale] = options.plural_forms
    }

    // sprintf equivalent, takes a string and some arguments to make a computed string
    // eg: strfmt("%1 dogs are in %2", 7, "the kitchen"); => "7 dogs are in the kitchen"
    // eg: strfmt("I like %1, bananas and %1", "apples"); => "I like apples, bananas and apples"
    // NB: removes msg context if there is one present
    let strfmt = function (fmt) {
        let args = arguments

        return (
            fmt
                // put space after double % to prevent placeholder replacement of such matches
                .replace(/%%/g, '%% ')
                // replace placeholders
                .replace(/%(\d+)/g, function (str, p1) {
                    return args[p1]
                })
                // replace double % and space with single %
                .replace(/%% /g, '%')
        )
    }

    let removeContext = function (str) {
        // if there is context, remove it
        if (str.indexOf(_ctxt_delimiter) !== -1) {
            let parts = str.split(_ctxt_delimiter)
            return parts[1]
        }

        return str
    }

    let expand_locale = function (locale) {
        let locales = [locale]
        let i = locale.lastIndexOf('-')
        while (i > 0) {
            // eslint-disable-next-line no-param-reassign
            locale = locale.slice(0, i)
            locales.push(locale)
            i = locale.lastIndexOf('-')
        }
        return locales
    }

    // Proper translation function that handle plurals and directives
    // Contains juicy parts of https://github.com/Orange-OpenSource/gettext.js/blob/master/lib.gettext.js
    let t = function (messages, n, options /* ,extra */) {
        // Singular is very easy, just pass dictionnary message through strfmt
        if (!options.plural_form)
            return strfmt.apply(strfmt, [removeContext(messages[0])].concat(Array.prototype.slice.call(arguments, 3)))

        let plural = _plural_forms[_locale].func(n)

        // If there is a problem with plurals, fallback to singular one
        if (typeof plural.plural === 'undefined' || plural.plural > plural.nplurals || messages.length <= plural.plural)
            plural.plural = 0

        return strfmt.apply(
            strfmt,
            [removeContext(messages[plural.plural]), n].concat(Array.prototype.slice.call(arguments, 3)),
        )
    }

    return {
        strfmt: strfmt, // expose strfmt util
        expand_locale: expand_locale, // expose expand_locale util

        // Declare shortcuts
        __: function () {
            return this.gettext.apply(this, arguments)
        },
        _n: function () {
            return this.ngettext.apply(this, arguments)
        },
        _p: function () {
            return this.pgettext.apply(this, arguments)
        },

        setMessages: function (domain, locale, messages, plural_forms) {
            if (!domain || !locale || !messages) throw new Error('You must provide a domain, a locale and messages')

            if ('string' !== typeof domain || 'string' !== typeof locale || !_.isObject(messages))
                throw new Error('Invalid arguments')

            if (plural_forms) _plural_forms[locale] = plural_forms

            if (!_dictionary[domain]) _dictionary[domain] = {}

            _dictionary[domain][locale] = messages

            return this
        },
        loadJSON: function (jsonData = {}, domain) {
            if (!jsonData[''] || !jsonData['']['language'] || !jsonData['']['plurals'])
                throw new Error('Wrong JSON, it must have an empty key ("") with "language" and "plurals" information')

            let headers = jsonData['']
            delete jsonData['']

            return this.setMessages(domain || defaults.domain, headers['language'], jsonData, headers['plurals'])
        },
        setLocale: function (locale) {
            _locale = locale
            return this
        },
        getLocale: function () {
            return _locale
        },
        // getter/setter for domain
        textdomain: function (domain) {
            if (!domain) return _domain
            _domain = domain
            return this
        },
        gettext: function (msgid /* , extra */) {
            return this.dcnpgettext.apply(
                this,
                [undefined, undefined, msgid, undefined, undefined].concat(Array.prototype.slice.call(arguments, 1)),
            )
        },
        ngettext: function (msgid, msgid_plural, n /* , extra */) {
            return this.dcnpgettext.apply(
                this,
                [undefined, undefined, msgid, msgid_plural, n].concat(Array.prototype.slice.call(arguments, 3)),
            )
        },
        pgettext: function (msgctxt, msgid /* , extra */) {
            return this.dcnpgettext.apply(
                this,
                [undefined, msgctxt, msgid, undefined, undefined].concat(Array.prototype.slice.call(arguments, 2)),
            )
        },
        dcnpgettext: function (domain, msgctxt, msgid, msgid_plural, n /* , extra */) {
            // eslint-disable-next-line no-param-reassign
            domain = domain || _domain

            if ('string' !== typeof msgid)
                throw new Error(this.strfmt('Msgid "%1" is not a valid translatable string', msgid))

            let translation
            let options = { plural_form: false }
            let key = msgctxt ? msgctxt + _ctxt_delimiter + msgid : msgid
            let exist
            let locale
            let locales = expand_locale(_locale)

            for (let i in locales) {
                if ({}.hasOwnProperty.call(locales, i)) {
                    locale = locales[i]
                    exist = _dictionary[domain] && _dictionary[domain][locale] && _dictionary[domain][locale][key]

                    // because it's not possible to define both a singular and a plural form of the same msgid,
                    // we need to check that the stored form is the same as the expected one.
                    // if not, we'll just ignore the translation and consider it as not translated.
                    if (msgid_plural) {
                        exist = exist && typeof _dictionary[domain][locale][key] !== 'string'
                    } else {
                        exist = exist && typeof _dictionary[domain][locale][key] === 'string'
                    }
                    if (exist) {
                        break
                    }
                }
            }

            if (!exist) {
                translation = msgid
                options.plural_func = defaults.plural_func
            } else {
                translation = _dictionary[domain][locale][key]
            }

            // Singular form
            if (!msgid_plural)
                return t.apply(this, [[translation], n, options].concat(Array.prototype.slice.call(arguments, 5)))

            // Plural one
            options.plural_form = true
            return t.apply(
                this,
                [exist ? translation : [msgid, msgid_plural], n, options].concat(
                    Array.prototype.slice.call(arguments, 5),
                ),
            )
        },
    }
}

export default i18n
