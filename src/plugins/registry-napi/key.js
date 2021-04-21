'use strict';
/**
 * An object wrapper for easier use of registry api
 */
class Key {
    constructor (pHKeyOrPredefined, path, accessLevel) {
        var isPredefined = false;
        this._registry = require('./registry');
        this._windef = require('./windef');
        for (var k in this._windef.HKEY) {
            if (this._windef.HKEY[k] === pHKeyOrPredefined) {
                isPredefined = true;
                break;
            }
        }

        // this is a predefined key
        if (isPredefined) {
            return this._registry.openKeyFromPredefined(pHKeyOrPredefined, path, accessLevel);
        }

        this.handle = pHKeyOrPredefined;
        this.path = path;
    }

    /**
    * Closes this Key, releasing the native OS handle
    * all the containers matching the query. Automatically closes current key
    */
    close () {
        this._registry.closeKey(this);
    }

    deleteKey () {
        this._registry.deleteKey(this);
    }

    /**
     * Deletes a value from a key
     */
    deleteValue (value) {
        this._registry.deleteValue(this, value);
    }

    /**
    * Sets a value for a value name on this key
    * all the containers matching the query.
    * @param  {DS.Record Container} selectedContainer - The container to be selected
    */
    setValue (valueName, valueType, value) {
        this._registry.setValueForKeyObject(this, valueName, valueType, value);
    }

    getValue (valueName) {
        return this._registry.queryValueForKeyObject(this, valueName);
    }

    /**
    * Returns a new Key object given a subkeyName
    * @param  {string} subKeyName - The container to be selected
    * @param  {string} accessLevel - The container to be selected
    * @return {Key}
    */
    openSubKey (subKeyName, accessLevel) {
        var key = this._registry.openKeyFromKeyObject(this, subKeyName, accessLevel);
        return key;
    }

    createSubKey (subKeyName, accessLevel) {
        this._registry.createKey(this, subKeyName, accessLevel);

        return new Key(this.handle, subKeyName, accessLevel);
    }

    /**
     * Returns the string representing this Key
     */
    toString () {
        return this.path;
    }
}

module.exports = Key;
