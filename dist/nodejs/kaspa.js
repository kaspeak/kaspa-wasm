
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextEncoder, TextDecoder, inspect } = require(`util`);

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export_0(addHeapObject(e));
    }
}

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_4.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_4.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_4.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
 * Returns true if the script passed is a pay-to-script-hash (P2SH) format, false otherwise.
 * @param script - The script ({@link HexString} or Uint8Array).
 * @category Wallet SDK
 * @param {HexString | Uint8Array} script
 * @returns {boolean}
 */
module.exports.isScriptPayToScriptHash = function(script) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.isScriptPayToScriptHash(retptr, addHeapObject(script));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Returns returns true if the script passed is an ECDSA pay-to-pubkey.
 * @param script - The script ({@link HexString} or Uint8Array).
 * @category Wallet SDK
 * @param {HexString | Uint8Array} script
 * @returns {boolean}
 */
module.exports.isScriptPayToPubkeyECDSA = function(script) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.isScriptPayToPubkeyECDSA(retptr, addHeapObject(script));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Returns true if the script passed is a pay-to-pubkey.
 * @param script - The script ({@link HexString} or Uint8Array).
 * @category Wallet SDK
 * @param {HexString | Uint8Array} script
 * @returns {boolean}
 */
module.exports.isScriptPayToPubkey = function(script) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.isScriptPayToPubkey(retptr, addHeapObject(script));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Returns the address encoded in a script public key.
 * @param script_public_key - The script public key ({@link ScriptPublicKey}).
 * @param network - The network type.
 * @category Wallet SDK
 * @param {ScriptPublicKey | HexString} script_public_key
 * @param {NetworkType | NetworkId | string} network
 * @returns {Address | undefined}
 */
module.exports.addressFromScriptPublicKey = function(script_public_key, network) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.addressFromScriptPublicKey(retptr, addBorrowedObject(script_public_key), addBorrowedObject(network));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
};

/**
 * Generates a signature script that fits a pay-to-script-hash script.
 * @param redeem_script - The redeem script ({@link HexString} or Uint8Array).
 * @param signature - The signature ({@link HexString} or Uint8Array).
 * @category Wallet SDK
 * @param {HexString | Uint8Array} redeem_script
 * @param {HexString | Uint8Array} signature
 * @returns {HexString}
 */
module.exports.payToScriptHashSignatureScript = function(redeem_script, signature) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.payToScriptHashSignatureScript(retptr, addHeapObject(redeem_script), addHeapObject(signature));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Takes a script and returns an equivalent pay-to-script-hash script.
 * @param redeem_script - The redeem script ({@link HexString} or Uint8Array).
 * @category Wallet SDK
 * @param {HexString | Uint8Array} redeem_script
 * @returns {ScriptPublicKey}
 */
module.exports.payToScriptHashScript = function(redeem_script) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.payToScriptHashScript(retptr, addHeapObject(redeem_script));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return ScriptPublicKey.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Creates a new script to pay a transaction output to the specified address.
 * @category Wallet SDK
 * @param {Address | string} address
 * @returns {ScriptPublicKey}
 */
module.exports.payToAddressScript = function(address) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.payToAddressScript(retptr, addBorrowedObject(address));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return ScriptPublicKey.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
};

/**
 * Calculates target from difficulty, based on set_difficulty function on
 * <https://github.com/tmrlvi/kaspa-miner/blob/bf361d02a46c580f55f46b5dfa773477634a5753/src/client/stratum.rs#L375>
 * @category Mining
 * @param {number} difficulty
 * @returns {bigint}
 */
module.exports.calculateTarget = function(difficulty) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateTarget(retptr, difficulty);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * WASM32 binding for `argon2sha256iv` hash function.
 * @param text - The text string to hash.
 * @category Encryption
 * @param {string} text
 * @param {number} byteLength
 * @returns {HexString}
 */
module.exports.argon2sha256ivFromText = function(text, byteLength) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.argon2sha256ivFromText(retptr, ptr0, len0, byteLength);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * WASM32 binding for `argon2sha256iv` hash function.
 * @param data - The data to hash ({@link HexString} or Uint8Array).
 * @category Encryption
 * @param {HexString | Uint8Array} data
 * @param {number} hashLength
 * @returns {HexString}
 */
module.exports.argon2sha256ivFromBinary = function(data, hashLength) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.argon2sha256ivFromBinary(retptr, addHeapObject(data), hashLength);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * WASM32 binding for `SHA256d` hash function.
 * @param {string} text - The text string to hash.
 * @category Encryption
 * @param {string} text
 * @returns {HexString}
 */
module.exports.sha256dFromText = function(text) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.sha256dFromText(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * WASM32 binding for `SHA256d` hash function.
 * @param data - The data to hash ({@link HexString} or Uint8Array).
 * @category Encryption
 * @param {HexString | Uint8Array} data
 * @returns {HexString}
 */
module.exports.sha256dFromBinary = function(data) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.sha256dFromBinary(retptr, addHeapObject(data));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * WASM32 binding for `SHA256` hash function.
 * @param {string} text - The text string to hash.
 * @category Encryption
 * @param {string} text
 * @returns {HexString}
 */
module.exports.sha256FromText = function(text) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.sha256FromText(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * WASM32 binding for `SHA256` hash function.
 * @param data - The data to hash ({@link HexString} or Uint8Array).
 * @category Encryption
 * @param {HexString | Uint8Array} data
 * @returns {HexString}
 */
module.exports.sha256FromBinary = function(data) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.sha256FromBinary(retptr, addHeapObject(data));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * WASM32 binding for `decryptXChaCha20Poly1305` function.
 * @category Encryption
 * @param {string} base64string
 * @param {string} password
 * @returns {string}
 */
module.exports.decryptXChaCha20Poly1305 = function(base64string, password) {
    let deferred4_0;
    let deferred4_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(base64string, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(password, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len1 = WASM_VECTOR_LEN;
        wasm.decryptXChaCha20Poly1305(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr3 = r0;
        var len3 = r1;
        if (r3) {
            ptr3 = 0; len3 = 0;
            throw takeObject(r2);
        }
        deferred4_0 = ptr3;
        deferred4_1 = len3;
        return getStringFromWasm0(ptr3, len3);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export_3(deferred4_0, deferred4_1, 1);
    }
};

/**
 * WASM32 binding for `encryptXChaCha20Poly1305` function.
 * @returns The encrypted text as a base64 string.
 * @category Encryption
 * @param {string} plainText
 * @param {string} password
 * @returns {string}
 */
module.exports.encryptXChaCha20Poly1305 = function(plainText, password) {
    let deferred4_0;
    let deferred4_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(plainText, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(password, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len1 = WASM_VECTOR_LEN;
        wasm.encryptXChaCha20Poly1305(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr3 = r0;
        var len3 = r1;
        if (r3) {
            ptr3 = 0; len3 = 0;
            throw takeObject(r2);
        }
        deferred4_0 = ptr3;
        deferred4_1 = len3;
        return getStringFromWasm0(ptr3, len3);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export_3(deferred4_0, deferred4_1, 1);
    }
};

/**
 * `calculateStorageMass()` is a helper function to compute the storage mass of inputs and outputs.
 * This function can be use to calculate the storage mass of transaction inputs and outputs.
 * Note that the storage mass is only a component of the total transaction mass. You are not
 * meant to use this function by itself and should use `calculateTransactionMass()` instead.
 * This function purely exists for diagnostic purposes and to help with complex algorithms that
 * may require a manual UTXO selection for identifying UTXOs and outputs needed for low storage mass.
 *
 * @category Wallet SDK
 * @see {@link maximumStandardTransactionMass}
 * @see {@link calculateTransactionMass}
 * @param {NetworkId | string} network_id
 * @param {Array<number>} input_values
 * @param {Array<number>} output_values
 * @returns {bigint | undefined}
 */
module.exports.calculateStorageMass = function(network_id, input_values, output_values) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-32);
        wasm.calculateStorageMass(retptr, addHeapObject(network_id), addBorrowedObject(input_values), addBorrowedObject(output_values));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
        var r4 = getDataViewMemory0().getInt32(retptr + 4 * 4, true);
        var r5 = getDataViewMemory0().getInt32(retptr + 4 * 5, true);
        if (r5) {
            throw takeObject(r4);
        }
        return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(32);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
};

/**
 * `calculateTransactionFee()` returns minimum fees needed for the transaction to be
 * accepted by the network. If the transaction is invalid or the mass can not be calculated,
 * the function throws an error. If the mass exceeds the maximum standard transaction mass,
 * the function returns `undefined`.
 *
 * @category Wallet SDK
 * @see {@link maximumStandardTransactionMass}
 * @see {@link calculateTransactionMass}
 * @see {@link updateTransactionMass}
 * @param {NetworkId | string} network_id
 * @param {ITransaction | Transaction} tx
 * @param {number | null} [minimum_signatures]
 * @returns {bigint | undefined}
 */
module.exports.calculateTransactionFee = function(network_id, tx, minimum_signatures) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-32);
        wasm.calculateTransactionFee(retptr, addHeapObject(network_id), addBorrowedObject(tx), isLikeNone(minimum_signatures) ? 0xFFFFFF : minimum_signatures);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
        var r4 = getDataViewMemory0().getInt32(retptr + 4 * 4, true);
        var r5 = getDataViewMemory0().getInt32(retptr + 4 * 5, true);
        if (r5) {
            throw takeObject(r4);
        }
        return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(32);
        heap[stack_pointer++] = undefined;
    }
};

/**
 * `updateTransactionMass()` updates the mass property of the passed transaction.
 * If the transaction is invalid, the function throws an error.
 *
 * The function returns `true` if the mass is within the maximum standard transaction mass and
 * the transaction mass is updated. Otherwise, the function returns `false`.
 *
 * This is similar to `calculateTransactionMass()` but modifies the supplied
 * `Transaction` object.
 *
 * @category Wallet SDK
 * @see {@link maximumStandardTransactionMass}
 * @see {@link calculateTransactionMass}
 * @see {@link calculateTransactionFee}
 * @param {NetworkId | string} network_id
 * @param {Transaction} tx
 * @param {number | null} [minimum_signatures]
 * @returns {boolean}
 */
module.exports.updateTransactionMass = function(network_id, tx, minimum_signatures) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(tx, Transaction);
        wasm.updateTransactionMass(retptr, addHeapObject(network_id), tx.__wbg_ptr, isLikeNone(minimum_signatures) ? 0xFFFFFF : minimum_signatures);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * `calculateTransactionMass()` returns the mass of the passed transaction.
 * If the transaction is invalid, or the mass can not be calculated
 * the function throws an error.
 *
 * The mass value must not exceed the maximum standard transaction mass
 * that can be obtained using `maximumStandardTransactionMass()`.
 *
 * @category Wallet SDK
 * @see {@link maximumStandardTransactionMass}
 * @param {NetworkId | string} network_id
 * @param {ITransaction | Transaction} tx
 * @param {number | null} [minimum_signatures]
 * @returns {bigint}
 */
module.exports.calculateTransactionMass = function(network_id, tx, minimum_signatures) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateTransactionMass(retptr, addHeapObject(network_id), addBorrowedObject(tx), isLikeNone(minimum_signatures) ? 0xFFFFFF : minimum_signatures);
        var r0 = getDataViewMemory0().getBigInt64(retptr + 8 * 0, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        return BigInt.asUintN(64, r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
};

/**
 * `maximumStandardTransactionMass()` returns the maximum transaction
 * size allowed by the network.
 *
 * @category Wallet SDK
 * @see {@link calculateTransactionMass}
 * @see {@link updateTransactionMass}
 * @see {@link calculateTransactionFee}
 * @returns {bigint}
 */
module.exports.maximumStandardTransactionMass = function() {
    const ret = wasm.maximumStandardTransactionMass();
    return BigInt.asUintN(64, ret);
};

/**
 * @category Wallet SDK
 * @param {any} script_hash
 * @param {PrivateKey} privkey
 * @returns {string}
 */
module.exports.signScriptHash = function(script_hash, privkey) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(privkey, PrivateKey);
        wasm.signScriptHash(retptr, addHeapObject(script_hash), privkey.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
    }
};

/**
 * `createInputSignature()` is a helper function to sign a transaction input with a specific SigHash type using a private key.
 * @category Wallet SDK
 * @param {Transaction} tx
 * @param {number} input_index
 * @param {PrivateKey} private_key
 * @param {SighashType | null} [sighash_type]
 * @returns {HexString}
 */
module.exports.createInputSignature = function(tx, input_index, private_key, sighash_type) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(tx, Transaction);
        _assertClass(private_key, PrivateKey);
        wasm.createInputSignature(retptr, tx.__wbg_ptr, input_index, private_key.__wbg_ptr, isLikeNone(sighash_type) ? 6 : sighash_type);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * `signTransaction()` is a helper function to sign a transaction using a private key array or a signer array.
 * @category Wallet SDK
 * @param {Transaction} tx
 * @param {(PrivateKey | HexString | Uint8Array)[]} signer
 * @param {boolean} verify_sig
 * @returns {Transaction}
 */
module.exports.signTransaction = function(tx, signer, verify_sig) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(tx, Transaction);
        wasm.signTransaction(retptr, tx.__wbg_ptr, addBorrowedObject(signer), verify_sig);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return Transaction.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
};

/**
 * @category Wallet SDK
 * @param {PublicKey | string} key
 * @param {NetworkType | NetworkId | string} network
 * @param {boolean | null} [ecdsa]
 * @param {AccountKind | null} [account_kind]
 * @returns {Address}
 */
module.exports.createAddress = function(key, network, ecdsa, account_kind) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        let ptr0 = 0;
        if (!isLikeNone(account_kind)) {
            _assertClass(account_kind, AccountKind);
            ptr0 = account_kind.__destroy_into_raw();
        }
        wasm.createAddress(retptr, addBorrowedObject(key), addBorrowedObject(network), isLikeNone(ecdsa) ? 0xFFFFFF : ecdsa ? 1 : 0, ptr0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return Address.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
};

/**
 * @category Wallet SDK
 * @param {number} minimum_signatures
 * @param {(PublicKey | string)[]} keys
 * @param {NetworkType} network_type
 * @param {boolean | null} [ecdsa]
 * @param {AccountKind | null} [account_kind]
 * @returns {Address}
 */
module.exports.createMultisigAddress = function(minimum_signatures, keys, network_type, ecdsa, account_kind) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        let ptr0 = 0;
        if (!isLikeNone(account_kind)) {
            _assertClass(account_kind, AccountKind);
            ptr0 = account_kind.__destroy_into_raw();
        }
        wasm.createMultisigAddress(retptr, minimum_signatures, addBorrowedObject(keys), network_type, isLikeNone(ecdsa) ? 0xFFFFFF : ecdsa ? 1 : 0, ptr0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return Address.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
};

/**
 * @param {bigint} blockDaaScore
 * @param {bigint} currentDaaScore
 * @param {NetworkId | string} networkId
 * @param {boolean} isCoinbase
 * @returns {string}
 */
module.exports.getTransactionMaturityProgress = function(blockDaaScore, currentDaaScore, networkId, isCoinbase) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getTransactionMaturityProgress(retptr, addHeapObject(blockDaaScore), addHeapObject(currentDaaScore), addHeapObject(networkId), isCoinbase);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
    }
};

/**
 * @param {NetworkId | string} networkId
 * @returns {INetworkParams}
 */
module.exports.getNetworkParams = function(networkId) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getNetworkParams(retptr, addHeapObject(networkId));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 *
 * Format a Sompi amount to a string representation of the amount in Kaspa with a suffix
 * based on the network type (e.g. `KAS` for mainnet, `TKAS` for testnet,
 * `SKAS` for simnet, `DKAS` for devnet).
 *
 * @category Wallet SDK
 * @param {bigint | number | HexString} sompi
 * @param {NetworkType | NetworkId | string} network
 * @returns {string}
 */
module.exports.sompiToKaspaStringWithSuffix = function(sompi, network) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.sompiToKaspaStringWithSuffix(retptr, addHeapObject(sompi), addBorrowedObject(network));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
    }
};

/**
 *
 * Convert Sompi to a string representation of the amount in Kaspa.
 *
 * @category Wallet SDK
 * @param {bigint | number | HexString} sompi
 * @returns {string}
 */
module.exports.sompiToKaspaString = function(sompi) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.sompiToKaspaString(retptr, addHeapObject(sompi));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
    }
};

/**
 * Convert a Kaspa string to Sompi represented by bigint.
 * This function provides correct precision handling and
 * can be used to parse user input.
 * @category Wallet SDK
 * @param {string} kaspa
 * @returns {bigint | undefined}
 */
module.exports.kaspaToSompi = function(kaspa) {
    const ptr0 = passStringToWasm0(kaspa, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.kaspaToSompi(ptr0, len0);
    return takeObject(ret);
};

/**
 * Helper function that creates an estimate using the transaction {@link Generator}
 * by producing only the {@link GeneratorSummary} containing the estimate.
 * @see {@link IGeneratorSettingsObject}, {@link Generator}, {@link createTransactions}
 * @category Wallet SDK
 * @param {IGeneratorSettingsObject} settings
 * @returns {Promise<GeneratorSummary>}
 */
module.exports.estimateTransactions = function(settings) {
    const ret = wasm.estimateTransactions(addHeapObject(settings));
    return takeObject(ret);
};

/**
 * Helper function that creates a set of transactions using the transaction {@link Generator}.
 * @see {@link IGeneratorSettingsObject}, {@link Generator}, {@link estimateTransactions}
 * @category Wallet SDK
 * @param {IGeneratorSettingsObject} settings
 * @returns {Promise<ICreateTransactions>}
 */
module.exports.createTransactions = function(settings) {
    const ret = wasm.createTransactions(addHeapObject(settings));
    return takeObject(ret);
};

/**
 * Create a basic transaction without any mass limit checks.
 * @category Wallet SDK
 * @param {IUtxoEntry[]} utxo_entry_source
 * @param {IPaymentOutput[]} outputs
 * @param {bigint} priority_fee
 * @param {HexString | Uint8Array | null} [payload]
 * @param {number | null} [sig_op_count]
 * @returns {Transaction}
 */
module.exports.createTransaction = function(utxo_entry_source, outputs, priority_fee, payload, sig_op_count) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.createTransaction(retptr, addHeapObject(utxo_entry_source), addHeapObject(outputs), addHeapObject(priority_fee), isLikeNone(payload) ? 0 : addHeapObject(payload), isLikeNone(sig_op_count) ? 0xFFFFFF : sig_op_count);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return Transaction.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Set a custom storage folder for the wallet SDK
 * subsystem.  Encrypted wallet files and transaction
 * data will be stored in this folder. If not set
 * the storage folder will default to `~/.kaspa`
 * (note that the folder is hidden).
 *
 * This must be called before using any other wallet
 * SDK functions.
 *
 * NOTE: This function will create a folder if it
 * doesn't exist. This function will have no effect
 * if invoked in the browser environment.
 *
 * @param {String} folder - the path to the storage folder
 *
 * @category Wallet API
 */
module.exports.setDefaultStorageFolder = function(folder) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(folder, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.setDefaultStorageFolder(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Set the name of the default wallet file name
 * or the `localStorage` key.  If `Wallet::open`
 * is called without a wallet file name, this name
 * will be used.  Please note that this name
 * will be suffixed with `.wallet` suffix.
 *
 * This function should be called before using any
 * other wallet SDK functions.
 *
 * @param {String} folder - the name to the wallet file or key.
 *
 * @category Wallet API
 * @param {string} folder
 */
module.exports.setDefaultWalletFile = function(folder) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(folder, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.setDefaultWalletFile(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Verifies with a public key the signature of the given message
 * @category Message Signing
 */
module.exports.verifyMessage = function(value) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyMessage(retptr, addHeapObject(value));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Signs a message with the given private key
 * @category Message Signing
 * @param {ISignMessage} value
 * @returns {HexString}
 */
module.exports.signMessage = function(value) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.signMessage(retptr, addHeapObject(value));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Returns the version of the Rusty Kaspa framework.
 * @category General
 * @returns {string}
 */
module.exports.version = function() {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.version(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
};

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}
/**
 * Set the logger log level using a string representation.
 * Available variants are: 'off', 'error', 'warn', 'info', 'debug', 'trace'
 * @category General
 * @param {"off" | "error" | "warn" | "info" | "debug" | "trace"} level
 */
module.exports.setLogLevel = function(level) {
    wasm.setLogLevel(addHeapObject(level));
};

/**
 * Configuration for the WASM32 bindings runtime interface.
 * @see {@link IWASM32BindingsConfig}
 * @category General
 * @param {IWASM32BindingsConfig} config
 */
module.exports.initWASM32Bindings = function(config) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.initWASM32Bindings(retptr, addHeapObject(config));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * Initialize Rust panic handler in console mode.
 *
 * This will output additional debug information during a panic to the console.
 * This function should be called right after loading WASM libraries.
 * @category General
 */
module.exports.initConsolePanicHook = function() {
    wasm.initConsolePanicHook();
};

/**
 * Initialize Rust panic handler in browser mode.
 *
 * This will output additional debug information during a panic in the browser
 * by creating a full-screen `DIV`. This is useful on mobile devices or where
 * the user otherwise has no access to console/developer tools. Use
 * {@link presentPanicHookLogs} to activate the panic logs in the
 * browser environment.
 * @see {@link presentPanicHookLogs}
 * @category General
 */
module.exports.initBrowserPanicHook = function() {
    wasm.initBrowserPanicHook();
};

/**
 * Present panic logs to the user in the browser.
 *
 * This function should be called after a panic has occurred and the
 * browser-based panic hook has been activated. It will present the
 * collected panic logs in a full-screen `DIV` in the browser.
 * @see {@link initBrowserPanicHook}
 * @category General
 */
module.exports.presentPanicHookLogs = function() {
    wasm.presentPanicHookLogs();
};

/**
 * r" Deferred promise - an object that has `resolve()` and `reject()`
 * r" functions that can be called outside of the promise body.
 * r" WARNING: This function uses `eval` and can not be used in environments
 * r" where dynamically-created code can not be executed such as web browser
 * r" extensions.
 * r" @category General
 * @returns {Promise<any>}
 */
module.exports.defer = function() {
    const ret = wasm.defer();
    return takeObject(ret);
};

function __wbg_adapter_66(arg0, arg1) {
    wasm.__wbindgen_export_5(arg0, arg1);
}

function __wbg_adapter_69(arg0, arg1, arg2) {
    wasm.__wbindgen_export_6(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_72(arg0, arg1) {
    wasm.__wbindgen_export_7(arg0, arg1);
}

function __wbg_adapter_75(arg0, arg1, arg2) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.__wbindgen_export_8(retptr, arg0, arg1, addHeapObject(arg2));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function __wbg_adapter_78(arg0, arg1, arg2) {
    wasm.__wbindgen_export_9(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_81(arg0, arg1, arg2, arg3) {
    const ret = wasm.__wbindgen_export_10(arg0, arg1, addHeapObject(arg2), arg3);
    return takeObject(ret);
}

function __wbg_adapter_84(arg0, arg1, arg2) {
    wasm.__wbindgen_export_11(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_87(arg0, arg1, arg2) {
    wasm.__wbindgen_export_11(arg0, arg1, arg2);
}

function __wbg_adapter_90(arg0, arg1, arg2) {
    wasm.__wbindgen_export_12(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_199(arg0, arg1, arg2, arg3) {
    wasm.__wbindgen_export_13(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
 * @category Wallet API
 * @enum {0}
 */
module.exports.AccountsDiscoveryKind = Object.freeze({
    Bip44: 0, "0": "Bip44",
});
/**
 *
 *  Kaspa `Address` version (`PubKey`, `PubKey ECDSA`, `ScriptHash`)
 *
 * @category Address
 * @enum {0 | 1 | 8}
 */
module.exports.AddressVersion = Object.freeze({
    /**
     * PubKey addresses always have the version byte set to 0
     */
    PubKey: 0, "0": "PubKey",
    /**
     * PubKey ECDSA addresses always have the version byte set to 1
     */
    PubKeyECDSA: 1, "1": "PubKeyECDSA",
    /**
     * ScriptHash addresses always have the version byte set to 8
     */
    ScriptHash: 8, "8": "ScriptHash",
});
/**
 * Specifies the type of an account address to be used in
 * commit reveal redeem script and also to spend reveal
 * operation to.
 *
 * @category Wallet API
 * @enum {0 | 1}
 */
module.exports.CommitRevealAddressKind = Object.freeze({
    Receive: 0, "0": "Receive",
    Change: 1, "1": "Change",
});
/**
 * `ConnectionStrategy` specifies how the WebSocket `async fn connect()`
 * function should behave during the first-time connectivity phase.
 * @category WebSocket
 * @enum {0 | 1}
 */
module.exports.ConnectStrategy = Object.freeze({
    /**
     * Continuously attempt to connect to the server. This behavior will
     * block `connect()` function until the connection is established.
     */
    Retry: 0, "0": "Retry",
    /**
     * Causes `connect()` to return immediately if the first-time connection
     * has failed.
     */
    Fallback: 1, "1": "Fallback",
});
/**
 * wRPC protocol encoding: `Borsh` or `JSON`
 * @category Transport
 * @enum {0 | 1}
 */
module.exports.Encoding = Object.freeze({
    Borsh: 0, "0": "Borsh",
    SerdeJson: 1, "1": "SerdeJson",
});
/**
 *
 * @see {@link IFees}, {@link IGeneratorSettingsObject}, {@link Generator}, {@link estimateTransactions}, {@link createTransactions}
 * @category Wallet SDK
 * @enum {0 | 1}
 */
module.exports.FeeSource = Object.freeze({
    SenderPays: 0, "0": "SenderPays",
    ReceiverPays: 1, "1": "ReceiverPays",
});
/**
 *
 * Languages supported by BIP39.
 *
 * Presently only English is specified by the BIP39 standard.
 *
 * @see {@link Mnemonic}
 *
 * @category Wallet SDK
 * @enum {0}
 */
module.exports.Language = Object.freeze({
    /**
     * English is presently the only supported language
     */
    English: 0, "0": "English",
});
/**
 * @category Consensus
 * @enum {0 | 1 | 2 | 3}
 */
module.exports.NetworkType = Object.freeze({
    Mainnet: 0, "0": "Mainnet",
    Testnet: 1, "1": "Testnet",
    Devnet: 2, "2": "Devnet",
    Simnet: 3, "3": "Simnet",
});
/**
 * Specifies the type of an account address to create.
 * The address can bea receive address or a change address.
 *
 * @category Wallet API
 * @enum {0 | 1}
 */
module.exports.NewAddressKind = Object.freeze({
    Receive: 0, "0": "Receive",
    Change: 1, "1": "Change",
});
/**
 * Kaspa Transaction Script Opcodes
 * @see {@link ScriptBuilder}
 * @category Consensus
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 142 | 143 | 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 153 | 154 | 155 | 156 | 157 | 158 | 159 | 160 | 161 | 162 | 163 | 164 | 165 | 166 | 167 | 168 | 169 | 170 | 171 | 172 | 173 | 174 | 175 | 176 | 177 | 178 | 179 | 180 | 181 | 182 | 183 | 184 | 185 | 186 | 187 | 188 | 189 | 190 | 191 | 192 | 193 | 194 | 195 | 196 | 197 | 198 | 199 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 222 | 223 | 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 237 | 238 | 239 | 240 | 241 | 242 | 243 | 244 | 245 | 246 | 247 | 248 | 249 | 250 | 251 | 252 | 253 | 254 | 255}
 */
module.exports.Opcodes = Object.freeze({
    OpFalse: 0, "0": "OpFalse",
    OpData1: 1, "1": "OpData1",
    OpData2: 2, "2": "OpData2",
    OpData3: 3, "3": "OpData3",
    OpData4: 4, "4": "OpData4",
    OpData5: 5, "5": "OpData5",
    OpData6: 6, "6": "OpData6",
    OpData7: 7, "7": "OpData7",
    OpData8: 8, "8": "OpData8",
    OpData9: 9, "9": "OpData9",
    OpData10: 10, "10": "OpData10",
    OpData11: 11, "11": "OpData11",
    OpData12: 12, "12": "OpData12",
    OpData13: 13, "13": "OpData13",
    OpData14: 14, "14": "OpData14",
    OpData15: 15, "15": "OpData15",
    OpData16: 16, "16": "OpData16",
    OpData17: 17, "17": "OpData17",
    OpData18: 18, "18": "OpData18",
    OpData19: 19, "19": "OpData19",
    OpData20: 20, "20": "OpData20",
    OpData21: 21, "21": "OpData21",
    OpData22: 22, "22": "OpData22",
    OpData23: 23, "23": "OpData23",
    OpData24: 24, "24": "OpData24",
    OpData25: 25, "25": "OpData25",
    OpData26: 26, "26": "OpData26",
    OpData27: 27, "27": "OpData27",
    OpData28: 28, "28": "OpData28",
    OpData29: 29, "29": "OpData29",
    OpData30: 30, "30": "OpData30",
    OpData31: 31, "31": "OpData31",
    OpData32: 32, "32": "OpData32",
    OpData33: 33, "33": "OpData33",
    OpData34: 34, "34": "OpData34",
    OpData35: 35, "35": "OpData35",
    OpData36: 36, "36": "OpData36",
    OpData37: 37, "37": "OpData37",
    OpData38: 38, "38": "OpData38",
    OpData39: 39, "39": "OpData39",
    OpData40: 40, "40": "OpData40",
    OpData41: 41, "41": "OpData41",
    OpData42: 42, "42": "OpData42",
    OpData43: 43, "43": "OpData43",
    OpData44: 44, "44": "OpData44",
    OpData45: 45, "45": "OpData45",
    OpData46: 46, "46": "OpData46",
    OpData47: 47, "47": "OpData47",
    OpData48: 48, "48": "OpData48",
    OpData49: 49, "49": "OpData49",
    OpData50: 50, "50": "OpData50",
    OpData51: 51, "51": "OpData51",
    OpData52: 52, "52": "OpData52",
    OpData53: 53, "53": "OpData53",
    OpData54: 54, "54": "OpData54",
    OpData55: 55, "55": "OpData55",
    OpData56: 56, "56": "OpData56",
    OpData57: 57, "57": "OpData57",
    OpData58: 58, "58": "OpData58",
    OpData59: 59, "59": "OpData59",
    OpData60: 60, "60": "OpData60",
    OpData61: 61, "61": "OpData61",
    OpData62: 62, "62": "OpData62",
    OpData63: 63, "63": "OpData63",
    OpData64: 64, "64": "OpData64",
    OpData65: 65, "65": "OpData65",
    OpData66: 66, "66": "OpData66",
    OpData67: 67, "67": "OpData67",
    OpData68: 68, "68": "OpData68",
    OpData69: 69, "69": "OpData69",
    OpData70: 70, "70": "OpData70",
    OpData71: 71, "71": "OpData71",
    OpData72: 72, "72": "OpData72",
    OpData73: 73, "73": "OpData73",
    OpData74: 74, "74": "OpData74",
    OpData75: 75, "75": "OpData75",
    OpPushData1: 76, "76": "OpPushData1",
    OpPushData2: 77, "77": "OpPushData2",
    OpPushData4: 78, "78": "OpPushData4",
    Op1Negate: 79, "79": "Op1Negate",
    OpReserved: 80, "80": "OpReserved",
    OpTrue: 81, "81": "OpTrue",
    Op2: 82, "82": "Op2",
    Op3: 83, "83": "Op3",
    Op4: 84, "84": "Op4",
    Op5: 85, "85": "Op5",
    Op6: 86, "86": "Op6",
    Op7: 87, "87": "Op7",
    Op8: 88, "88": "Op8",
    Op9: 89, "89": "Op9",
    Op10: 90, "90": "Op10",
    Op11: 91, "91": "Op11",
    Op12: 92, "92": "Op12",
    Op13: 93, "93": "Op13",
    Op14: 94, "94": "Op14",
    Op15: 95, "95": "Op15",
    Op16: 96, "96": "Op16",
    OpNop: 97, "97": "OpNop",
    OpVer: 98, "98": "OpVer",
    OpIf: 99, "99": "OpIf",
    OpNotIf: 100, "100": "OpNotIf",
    OpVerIf: 101, "101": "OpVerIf",
    OpVerNotIf: 102, "102": "OpVerNotIf",
    OpElse: 103, "103": "OpElse",
    OpEndIf: 104, "104": "OpEndIf",
    OpVerify: 105, "105": "OpVerify",
    OpReturn: 106, "106": "OpReturn",
    OpToAltStack: 107, "107": "OpToAltStack",
    OpFromAltStack: 108, "108": "OpFromAltStack",
    Op2Drop: 109, "109": "Op2Drop",
    Op2Dup: 110, "110": "Op2Dup",
    Op3Dup: 111, "111": "Op3Dup",
    Op2Over: 112, "112": "Op2Over",
    Op2Rot: 113, "113": "Op2Rot",
    Op2Swap: 114, "114": "Op2Swap",
    OpIfDup: 115, "115": "OpIfDup",
    OpDepth: 116, "116": "OpDepth",
    OpDrop: 117, "117": "OpDrop",
    OpDup: 118, "118": "OpDup",
    OpNip: 119, "119": "OpNip",
    OpOver: 120, "120": "OpOver",
    OpPick: 121, "121": "OpPick",
    OpRoll: 122, "122": "OpRoll",
    OpRot: 123, "123": "OpRot",
    OpSwap: 124, "124": "OpSwap",
    OpTuck: 125, "125": "OpTuck",
    /**
     * Splice opcodes.
     */
    OpCat: 126, "126": "OpCat",
    OpSubStr: 127, "127": "OpSubStr",
    OpLeft: 128, "128": "OpLeft",
    OpRight: 129, "129": "OpRight",
    OpSize: 130, "130": "OpSize",
    /**
     * Bitwise logic opcodes.
     */
    OpInvert: 131, "131": "OpInvert",
    OpAnd: 132, "132": "OpAnd",
    OpOr: 133, "133": "OpOr",
    OpXor: 134, "134": "OpXor",
    OpEqual: 135, "135": "OpEqual",
    OpEqualVerify: 136, "136": "OpEqualVerify",
    OpReserved1: 137, "137": "OpReserved1",
    OpReserved2: 138, "138": "OpReserved2",
    /**
     * Numeric related opcodes.
     */
    Op1Add: 139, "139": "Op1Add",
    Op1Sub: 140, "140": "Op1Sub",
    Op2Mul: 141, "141": "Op2Mul",
    Op2Div: 142, "142": "Op2Div",
    OpNegate: 143, "143": "OpNegate",
    OpAbs: 144, "144": "OpAbs",
    OpNot: 145, "145": "OpNot",
    Op0NotEqual: 146, "146": "Op0NotEqual",
    OpAdd: 147, "147": "OpAdd",
    OpSub: 148, "148": "OpSub",
    OpMul: 149, "149": "OpMul",
    OpDiv: 150, "150": "OpDiv",
    OpMod: 151, "151": "OpMod",
    OpLShift: 152, "152": "OpLShift",
    OpRShift: 153, "153": "OpRShift",
    OpBoolAnd: 154, "154": "OpBoolAnd",
    OpBoolOr: 155, "155": "OpBoolOr",
    OpNumEqual: 156, "156": "OpNumEqual",
    OpNumEqualVerify: 157, "157": "OpNumEqualVerify",
    OpNumNotEqual: 158, "158": "OpNumNotEqual",
    OpLessThan: 159, "159": "OpLessThan",
    OpGreaterThan: 160, "160": "OpGreaterThan",
    OpLessThanOrEqual: 161, "161": "OpLessThanOrEqual",
    OpGreaterThanOrEqual: 162, "162": "OpGreaterThanOrEqual",
    OpMin: 163, "163": "OpMin",
    OpMax: 164, "164": "OpMax",
    OpWithin: 165, "165": "OpWithin",
    /**
     * Undefined opcodes.
     */
    OpUnknown166: 166, "166": "OpUnknown166",
    OpUnknown167: 167, "167": "OpUnknown167",
    /**
     * Crypto opcodes.
     */
    OpSHA256: 168, "168": "OpSHA256",
    OpCheckMultiSigECDSA: 169, "169": "OpCheckMultiSigECDSA",
    OpBlake2b: 170, "170": "OpBlake2b",
    OpCheckSigECDSA: 171, "171": "OpCheckSigECDSA",
    OpCheckSig: 172, "172": "OpCheckSig",
    OpCheckSigVerify: 173, "173": "OpCheckSigVerify",
    OpCheckMultiSig: 174, "174": "OpCheckMultiSig",
    OpCheckMultiSigVerify: 175, "175": "OpCheckMultiSigVerify",
    OpCheckLockTimeVerify: 176, "176": "OpCheckLockTimeVerify",
    OpCheckSequenceVerify: 177, "177": "OpCheckSequenceVerify",
    /**
     * Undefined opcodes.
     */
    OpUnknown178: 178, "178": "OpUnknown178",
    OpUnknown179: 179, "179": "OpUnknown179",
    OpUnknown180: 180, "180": "OpUnknown180",
    OpUnknown181: 181, "181": "OpUnknown181",
    OpUnknown182: 182, "182": "OpUnknown182",
    OpUnknown183: 183, "183": "OpUnknown183",
    OpUnknown184: 184, "184": "OpUnknown184",
    OpUnknown185: 185, "185": "OpUnknown185",
    OpUnknown186: 186, "186": "OpUnknown186",
    OpUnknown187: 187, "187": "OpUnknown187",
    OpUnknown188: 188, "188": "OpUnknown188",
    OpUnknown189: 189, "189": "OpUnknown189",
    OpUnknown190: 190, "190": "OpUnknown190",
    OpUnknown191: 191, "191": "OpUnknown191",
    OpUnknown192: 192, "192": "OpUnknown192",
    OpUnknown193: 193, "193": "OpUnknown193",
    OpUnknown194: 194, "194": "OpUnknown194",
    OpUnknown195: 195, "195": "OpUnknown195",
    OpUnknown196: 196, "196": "OpUnknown196",
    OpUnknown197: 197, "197": "OpUnknown197",
    OpUnknown198: 198, "198": "OpUnknown198",
    OpUnknown199: 199, "199": "OpUnknown199",
    OpUnknown200: 200, "200": "OpUnknown200",
    OpUnknown201: 201, "201": "OpUnknown201",
    OpUnknown202: 202, "202": "OpUnknown202",
    OpUnknown203: 203, "203": "OpUnknown203",
    OpUnknown204: 204, "204": "OpUnknown204",
    OpUnknown205: 205, "205": "OpUnknown205",
    OpUnknown206: 206, "206": "OpUnknown206",
    OpUnknown207: 207, "207": "OpUnknown207",
    OpUnknown208: 208, "208": "OpUnknown208",
    OpUnknown209: 209, "209": "OpUnknown209",
    OpUnknown210: 210, "210": "OpUnknown210",
    OpUnknown211: 211, "211": "OpUnknown211",
    OpUnknown212: 212, "212": "OpUnknown212",
    OpUnknown213: 213, "213": "OpUnknown213",
    OpUnknown214: 214, "214": "OpUnknown214",
    OpUnknown215: 215, "215": "OpUnknown215",
    OpUnknown216: 216, "216": "OpUnknown216",
    OpUnknown217: 217, "217": "OpUnknown217",
    OpUnknown218: 218, "218": "OpUnknown218",
    OpUnknown219: 219, "219": "OpUnknown219",
    OpUnknown220: 220, "220": "OpUnknown220",
    OpUnknown221: 221, "221": "OpUnknown221",
    OpUnknown222: 222, "222": "OpUnknown222",
    OpUnknown223: 223, "223": "OpUnknown223",
    OpUnknown224: 224, "224": "OpUnknown224",
    OpUnknown225: 225, "225": "OpUnknown225",
    OpUnknown226: 226, "226": "OpUnknown226",
    OpUnknown227: 227, "227": "OpUnknown227",
    OpUnknown228: 228, "228": "OpUnknown228",
    OpUnknown229: 229, "229": "OpUnknown229",
    OpUnknown230: 230, "230": "OpUnknown230",
    OpUnknown231: 231, "231": "OpUnknown231",
    OpUnknown232: 232, "232": "OpUnknown232",
    OpUnknown233: 233, "233": "OpUnknown233",
    OpUnknown234: 234, "234": "OpUnknown234",
    OpUnknown235: 235, "235": "OpUnknown235",
    OpUnknown236: 236, "236": "OpUnknown236",
    OpUnknown237: 237, "237": "OpUnknown237",
    OpUnknown238: 238, "238": "OpUnknown238",
    OpUnknown239: 239, "239": "OpUnknown239",
    OpUnknown240: 240, "240": "OpUnknown240",
    OpUnknown241: 241, "241": "OpUnknown241",
    OpUnknown242: 242, "242": "OpUnknown242",
    OpUnknown243: 243, "243": "OpUnknown243",
    OpUnknown244: 244, "244": "OpUnknown244",
    OpUnknown245: 245, "245": "OpUnknown245",
    OpUnknown246: 246, "246": "OpUnknown246",
    OpUnknown247: 247, "247": "OpUnknown247",
    OpUnknown248: 248, "248": "OpUnknown248",
    OpUnknown249: 249, "249": "OpUnknown249",
    OpSmallInteger: 250, "250": "OpSmallInteger",
    OpPubKeys: 251, "251": "OpPubKeys",
    OpUnknown252: 252, "252": "OpUnknown252",
    OpPubKeyHash: 253, "253": "OpPubKeyHash",
    OpPubKey: 254, "254": "OpPubKey",
    OpInvalidOpCode: 255, "255": "OpInvalidOpCode",
});
/**
 * Kaspa Sighash types allowed by consensus
 * @category Consensus
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
module.exports.SighashType = Object.freeze({
    All: 0, "0": "All",
    None: 1, "1": "None",
    Single: 2, "2": "Single",
    AllAnyOneCanPay: 3, "3": "AllAnyOneCanPay",
    NoneAnyOneCanPay: 4, "4": "NoneAnyOneCanPay",
    SingleAnyOneCanPay: 5, "5": "SingleAnyOneCanPay",
});

const __wbindgen_enum_BinaryType = ["blob", "arraybuffer"];

const __wbindgen_enum_IdbCursorDirection = ["next", "nextunique", "prev", "prevunique"];

const __wbindgen_enum_IdbRequestReadyState = ["pending", "done"];

const __wbindgen_enum_IdbTransactionMode = ["readonly", "readwrite", "versionchange", "readwriteflush", "cleanup"];

const __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];

const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];

const AbortableFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_abortable_free(ptr >>> 0, 1));
/**
 *
 * Abortable trigger wraps an `Arc<AtomicBool>`, which can be cloned
 * to signal task terminating using an atomic bool.
 *
 * ```text
 * let abortable = Abortable::default();
 * let result = my_task(abortable).await?;
 * // ... elsewhere
 * abortable.abort();
 * ```
 *
 * @category General
 */
class Abortable {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AbortableFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_abortable_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.abortable_new();
        this.__wbg_ptr = ret >>> 0;
        AbortableFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {boolean}
     */
    isAborted() {
        const ret = wasm.abortable_isAborted(this.__wbg_ptr);
        return ret !== 0;
    }
    abort() {
        wasm.abortable_abort(this.__wbg_ptr);
    }
    check() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.abortable_check(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    reset() {
        wasm.abortable_reset(this.__wbg_ptr);
    }
}
module.exports.Abortable = Abortable;

const AbortedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_aborted_free(ptr >>> 0, 1));
/**
 * Error emitted by [`Abortable`].
 * @category General
 */
class Aborted {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Aborted.prototype);
        obj.__wbg_ptr = ptr;
        AbortedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AbortedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_aborted_free(ptr, 0);
    }
}
module.exports.Aborted = Aborted;

const AccountKindFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountkind_free(ptr >>> 0, 1));
/**
 *
 * Account kind is a string signature that represents an account type.
 * Account kind is used to identify the account type during
 * serialization, deserialization and various API calls.
 *
 * @category Wallet SDK
 */
class AccountKind {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountKind.prototype);
        obj.__wbg_ptr = ptr;
        AccountKindFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountKindFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountkind_free(ptr, 0);
    }
    /**
     * @param {string} kind
     */
    constructor(kind) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(kind, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.accountkind_ctor(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            AccountKindFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.accountkind_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.AccountKind = AccountKind;

const AddressFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_address_free(ptr >>> 0, 1));
/**
 * Kaspa [`Address`] struct that serializes to and from an address format string: `kaspa:qz0s...t8cv`.
 *
 * @category Address
 */
class Address {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Address.prototype);
        obj.__wbg_ptr = ptr;
        AddressFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            version: this.version,
            prefix: this.prefix,
            payload: this.payload,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AddressFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_address_free(ptr, 0);
    }
    /**
     * @param {string} address
     */
    constructor(address) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.address_constructor(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        AddressFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} address
     * @returns {boolean}
     */
    static validate(address) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.address_validate(ptr0, len0);
        return ret !== 0;
    }
    /**
     * Convert an address to a string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_version(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get prefix() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_prefix(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} prefix
     */
    set setPrefix(prefix) {
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.address_set_setPrefix(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    get payload() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_payload(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} n
     * @returns {string}
     */
    short(n) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_short(retptr, this.__wbg_ptr, n);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.Address = Address;

const AgentConstructorOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_agentconstructoroptions_free(ptr >>> 0, 1));

class AgentConstructorOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AgentConstructorOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_agentconstructoroptions_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get keep_alive_msecs() {
        const ret = wasm.agentconstructoroptions_keep_alive_msecs(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set keep_alive_msecs(value) {
        wasm.agentconstructoroptions_set_keep_alive_msecs(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get keep_alive() {
        const ret = wasm.agentconstructoroptions_keep_alive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set keep_alive(value) {
        wasm.agentconstructoroptions_set_keep_alive(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get max_free_sockets() {
        const ret = wasm.agentconstructoroptions_max_free_sockets(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set max_free_sockets(value) {
        wasm.agentconstructoroptions_set_max_free_sockets(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get max_sockets() {
        const ret = wasm.agentconstructoroptions_max_sockets(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set max_sockets(value) {
        wasm.agentconstructoroptions_set_max_sockets(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get timeout() {
        const ret = wasm.agentconstructoroptions_timeout(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set timeout(value) {
        wasm.agentconstructoroptions_set_timeout(this.__wbg_ptr, value);
    }
}
module.exports.AgentConstructorOptions = AgentConstructorOptions;

const AppendFileOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_appendfileoptions_free(ptr >>> 0, 1));

class AppendFileOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AppendFileOptions.prototype);
        obj.__wbg_ptr = ptr;
        AppendFileOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AppendFileOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_appendfileoptions_free(ptr, 0);
    }
    /**
     * @param {string | null} [encoding]
     * @param {number | null} [mode]
     * @param {string | null} [flag]
     */
    constructor(encoding, mode, flag) {
        const ret = wasm.appendfileoptions_new_with_values(isLikeNone(encoding) ? 0 : addHeapObject(encoding), isLikeNone(mode) ? 0x100000001 : (mode) >>> 0, isLikeNone(flag) ? 0 : addHeapObject(flag));
        this.__wbg_ptr = ret >>> 0;
        AppendFileOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {AppendFileOptions}
     */
    static new() {
        const ret = wasm.appendfileoptions_new();
        return AppendFileOptions.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.appendfileoptions_encoding(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.appendfileoptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {number | undefined}
     */
    get mode() {
        const ret = wasm.appendfileoptions_mode(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number | null} [value]
     */
    set mode(value) {
        wasm.appendfileoptions_set_mode(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
    /**
     * @returns {string | undefined}
     */
    get flag() {
        const ret = wasm.appendfileoptions_flag(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set flag(value) {
        wasm.appendfileoptions_set_flag(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
}
module.exports.AppendFileOptions = AppendFileOptions;

const AssertionErrorOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_assertionerroroptions_free(ptr >>> 0, 1));

class AssertionErrorOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AssertionErrorOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_assertionerroroptions_free(ptr, 0);
    }
    /**
     * @param {string | null | undefined} message
     * @param {any} actual
     * @param {any} expected
     * @param {string} operator
     */
    constructor(message, actual, expected, operator) {
        const ret = wasm.assertionerroroptions_new(isLikeNone(message) ? 0 : addHeapObject(message), addHeapObject(actual), addHeapObject(expected), addHeapObject(operator));
        this.__wbg_ptr = ret >>> 0;
        AssertionErrorOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * If provided, the error message is set to this value.
     * @returns {string | undefined}
     */
    get message() {
        const ret = wasm.assertionerroroptions_message(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set message(value) {
        wasm.assertionerroroptions_set_message(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * The actual property on the error instance.
     * @returns {any}
     */
    get actual() {
        const ret = wasm.assertionerroroptions_actual(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {any} value
     */
    set actual(value) {
        wasm.assertionerroroptions_set_actual(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * The expected property on the error instance.
     * @returns {any}
     */
    get expected() {
        const ret = wasm.assertionerroroptions_expected(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {any} value
     */
    set expected(value) {
        wasm.assertionerroroptions_set_expected(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * The operator property on the error instance.
     * @returns {string}
     */
    get operator() {
        const ret = wasm.assertionerroroptions_operator(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string} value
     */
    set operator(value) {
        wasm.assertionerroroptions_set_operator(this.__wbg_ptr, addHeapObject(value));
    }
}
module.exports.AssertionErrorOptions = AssertionErrorOptions;

const BalanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_balance_free(ptr >>> 0, 1));
/**
 *
 * Represents a {@link UtxoContext} (account) balance.
 *
 * @see {@link IBalance}, {@link UtxoContext}
 *
 * @category Wallet SDK
 */
class Balance {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Balance.prototype);
        obj.__wbg_ptr = ptr;
        BalanceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BalanceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_balance_free(ptr, 0);
    }
    /**
     * Confirmed amount of funds available for spending.
     * @returns {bigint}
     */
    get mature() {
        const ret = wasm.balance_mature(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Amount of funds that are being received and are not yet confirmed.
     * @returns {bigint}
     */
    get pending() {
        const ret = wasm.balance_pending(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Amount of funds that are being send and are not yet accepted by the network.
     * @returns {bigint}
     */
    get outgoing() {
        const ret = wasm.balance_outgoing(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {NetworkType | NetworkId | string} network_type
     * @returns {BalanceStrings}
     */
    toBalanceStrings(network_type) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.balance_toBalanceStrings(retptr, this.__wbg_ptr, addBorrowedObject(network_type));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return BalanceStrings.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.Balance = Balance;

const BalanceStringsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_balancestrings_free(ptr >>> 0, 1));
/**
 *
 * Formatted string representation of the {@link Balance}.
 *
 * The value is formatted as `123,456.789`.
 *
 * @category Wallet SDK
 */
class BalanceStrings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BalanceStrings.prototype);
        obj.__wbg_ptr = ptr;
        BalanceStringsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BalanceStringsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_balancestrings_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get mature() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.balancestrings_mature(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get pending() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.balancestrings_pending(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.BalanceStrings = BalanceStrings;

const ConsoleConstructorOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_consoleconstructoroptions_free(ptr >>> 0, 1));

class ConsoleConstructorOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ConsoleConstructorOptions.prototype);
        obj.__wbg_ptr = ptr;
        ConsoleConstructorOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ConsoleConstructorOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_consoleconstructoroptions_free(ptr, 0);
    }
    /**
     * @param {any} stdout
     * @param {any} stderr
     * @param {boolean | null | undefined} ignore_errors
     * @param {any} color_mod
     * @param {object | null} [inspect_options]
     */
    constructor(stdout, stderr, ignore_errors, color_mod, inspect_options) {
        const ret = wasm.consoleconstructoroptions_new_with_values(addHeapObject(stdout), addHeapObject(stderr), isLikeNone(ignore_errors) ? 0xFFFFFF : ignore_errors ? 1 : 0, addHeapObject(color_mod), isLikeNone(inspect_options) ? 0 : addHeapObject(inspect_options));
        this.__wbg_ptr = ret >>> 0;
        ConsoleConstructorOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} stdout
     * @param {any} stderr
     * @returns {ConsoleConstructorOptions}
     */
    static new(stdout, stderr) {
        const ret = wasm.consoleconstructoroptions_new(addHeapObject(stdout), addHeapObject(stderr));
        return ConsoleConstructorOptions.__wrap(ret);
    }
    /**
     * @returns {any}
     */
    get stdout() {
        const ret = wasm.consoleconstructoroptions_stdout(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {any} value
     */
    set stdout(value) {
        wasm.consoleconstructoroptions_set_stdout(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {any}
     */
    get stderr() {
        const ret = wasm.consoleconstructoroptions_stderr(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {any} value
     */
    set stderr(value) {
        wasm.consoleconstructoroptions_set_stderr(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {boolean | undefined}
     */
    get ignore_errors() {
        const ret = wasm.consoleconstructoroptions_ignore_errors(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [value]
     */
    set ignore_errors(value) {
        wasm.consoleconstructoroptions_set_ignore_errors(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {any}
     */
    get color_mod() {
        const ret = wasm.consoleconstructoroptions_color_mod(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {any} value
     */
    set color_mod(value) {
        wasm.consoleconstructoroptions_set_color_mod(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {object | undefined}
     */
    get inspect_options() {
        const ret = wasm.consoleconstructoroptions_inspect_options(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {object | null} [value]
     */
    set inspect_options(value) {
        wasm.consoleconstructoroptions_set_inspect_options(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
}
module.exports.ConsoleConstructorOptions = ConsoleConstructorOptions;

const CreateHookCallbacksFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_createhookcallbacks_free(ptr >>> 0, 1));

class CreateHookCallbacks {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CreateHookCallbacksFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_createhookcallbacks_free(ptr, 0);
    }
    /**
     * @param {Function} init
     * @param {Function} before
     * @param {Function} after
     * @param {Function} destroy
     * @param {Function} promise_resolve
     */
    constructor(init, before, after, destroy, promise_resolve) {
        try {
            const ret = wasm.createhookcallbacks_new(addBorrowedObject(init), addBorrowedObject(before), addBorrowedObject(after), addBorrowedObject(destroy), addBorrowedObject(promise_resolve));
            this.__wbg_ptr = ret >>> 0;
            CreateHookCallbacksFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {Function}
     */
    get init() {
        const ret = wasm.createhookcallbacks_init(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Function} value
     */
    set init(value) {
        wasm.createhookcallbacks_set_init(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {Function}
     */
    get before() {
        const ret = wasm.createhookcallbacks_before(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Function} value
     */
    set before(value) {
        wasm.createhookcallbacks_set_before(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {Function}
     */
    get after() {
        const ret = wasm.createhookcallbacks_after(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Function} value
     */
    set after(value) {
        wasm.createhookcallbacks_set_after(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {Function}
     */
    get destroy() {
        const ret = wasm.createhookcallbacks_destroy(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Function} value
     */
    set destroy(value) {
        wasm.createhookcallbacks_set_destroy(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {Function}
     */
    get promise_resolve() {
        const ret = wasm.createhookcallbacks_promise_resolve(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Function} value
     */
    set promise_resolve(value) {
        wasm.createhookcallbacks_set_promise_resolve(this.__wbg_ptr, addHeapObject(value));
    }
}
module.exports.CreateHookCallbacks = CreateHookCallbacks;

const CreateReadStreamOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_createreadstreamoptions_free(ptr >>> 0, 1));

class CreateReadStreamOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CreateReadStreamOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_createreadstreamoptions_free(ptr, 0);
    }
    /**
     * @param {boolean | null} [auto_close]
     * @param {boolean | null} [emit_close]
     * @param {string | null} [encoding]
     * @param {number | null} [end]
     * @param {number | null} [fd]
     * @param {string | null} [flags]
     * @param {number | null} [high_water_mark]
     * @param {number | null} [mode]
     * @param {number | null} [start]
     */
    constructor(auto_close, emit_close, encoding, end, fd, flags, high_water_mark, mode, start) {
        const ret = wasm.createreadstreamoptions_new_with_values(isLikeNone(auto_close) ? 0xFFFFFF : auto_close ? 1 : 0, isLikeNone(emit_close) ? 0xFFFFFF : emit_close ? 1 : 0, isLikeNone(encoding) ? 0 : addHeapObject(encoding), !isLikeNone(end), isLikeNone(end) ? 0 : end, isLikeNone(fd) ? 0x100000001 : (fd) >>> 0, isLikeNone(flags) ? 0 : addHeapObject(flags), !isLikeNone(high_water_mark), isLikeNone(high_water_mark) ? 0 : high_water_mark, isLikeNone(mode) ? 0x100000001 : (mode) >>> 0, !isLikeNone(start), isLikeNone(start) ? 0 : start);
        this.__wbg_ptr = ret >>> 0;
        CreateReadStreamOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {boolean | undefined}
     */
    get auto_close() {
        const ret = wasm.createreadstreamoptions_auto_close(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [value]
     */
    set auto_close(value) {
        wasm.createreadstreamoptions_set_auto_close(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {boolean | undefined}
     */
    get emit_close() {
        const ret = wasm.createreadstreamoptions_emit_close(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [value]
     */
    set emit_close(value) {
        wasm.createreadstreamoptions_set_emit_close(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.createreadstreamoptions_encoding(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.createreadstreamoptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {number | undefined}
     */
    get end() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.createreadstreamoptions_end(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : r2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number | null} [value]
     */
    set end(value) {
        wasm.createreadstreamoptions_set_end(this.__wbg_ptr, !isLikeNone(value), isLikeNone(value) ? 0 : value);
    }
    /**
     * @returns {number | undefined}
     */
    get fd() {
        const ret = wasm.createreadstreamoptions_fd(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number | null} [value]
     */
    set fd(value) {
        wasm.createreadstreamoptions_set_fd(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
    /**
     * @returns {string | undefined}
     */
    get flags() {
        const ret = wasm.createreadstreamoptions_flags(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set flags(value) {
        wasm.createreadstreamoptions_set_flags(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {number | undefined}
     */
    get high_water_mark() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.createreadstreamoptions_high_water_mark(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : r2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number | null} [value]
     */
    set high_water_mark(value) {
        wasm.createreadstreamoptions_set_high_water_mark(this.__wbg_ptr, !isLikeNone(value), isLikeNone(value) ? 0 : value);
    }
    /**
     * @returns {number | undefined}
     */
    get mode() {
        const ret = wasm.createreadstreamoptions_mode(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number | null} [value]
     */
    set mode(value) {
        wasm.createreadstreamoptions_set_mode(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
    /**
     * @returns {number | undefined}
     */
    get start() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.createreadstreamoptions_start(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : r2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number | null} [value]
     */
    set start(value) {
        wasm.createreadstreamoptions_set_start(this.__wbg_ptr, !isLikeNone(value), isLikeNone(value) ? 0 : value);
    }
}
module.exports.CreateReadStreamOptions = CreateReadStreamOptions;

const CreateWriteStreamOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_createwritestreamoptions_free(ptr >>> 0, 1));

class CreateWriteStreamOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CreateWriteStreamOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_createwritestreamoptions_free(ptr, 0);
    }
    /**
     * @param {boolean | null} [auto_close]
     * @param {boolean | null} [emit_close]
     * @param {string | null} [encoding]
     * @param {number | null} [fd]
     * @param {string | null} [flags]
     * @param {number | null} [mode]
     * @param {number | null} [start]
     */
    constructor(auto_close, emit_close, encoding, fd, flags, mode, start) {
        const ret = wasm.createwritestreamoptions_new_with_values(isLikeNone(auto_close) ? 0xFFFFFF : auto_close ? 1 : 0, isLikeNone(emit_close) ? 0xFFFFFF : emit_close ? 1 : 0, isLikeNone(encoding) ? 0 : addHeapObject(encoding), isLikeNone(fd) ? 0x100000001 : (fd) >>> 0, isLikeNone(flags) ? 0 : addHeapObject(flags), isLikeNone(mode) ? 0x100000001 : (mode) >>> 0, !isLikeNone(start), isLikeNone(start) ? 0 : start);
        this.__wbg_ptr = ret >>> 0;
        CreateWriteStreamOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {boolean | undefined}
     */
    get auto_close() {
        const ret = wasm.createwritestreamoptions_auto_close(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [value]
     */
    set auto_close(value) {
        wasm.createwritestreamoptions_set_auto_close(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {boolean | undefined}
     */
    get emit_close() {
        const ret = wasm.createwritestreamoptions_emit_close(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [value]
     */
    set emit_close(value) {
        wasm.createwritestreamoptions_set_emit_close(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.createwritestreamoptions_encoding(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.createwritestreamoptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {number | undefined}
     */
    get fd() {
        const ret = wasm.createwritestreamoptions_fd(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number | null} [value]
     */
    set fd(value) {
        wasm.createwritestreamoptions_set_fd(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
    /**
     * @returns {string | undefined}
     */
    get flags() {
        const ret = wasm.createwritestreamoptions_flags(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set flags(value) {
        wasm.createwritestreamoptions_set_flags(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {number | undefined}
     */
    get mode() {
        const ret = wasm.createwritestreamoptions_mode(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number | null} [value]
     */
    set mode(value) {
        wasm.createwritestreamoptions_set_mode(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
    /**
     * @returns {number | undefined}
     */
    get start() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.createwritestreamoptions_start(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : r2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number | null} [value]
     */
    set start(value) {
        wasm.createwritestreamoptions_set_start(this.__wbg_ptr, !isLikeNone(value), isLikeNone(value) ? 0 : value);
    }
}
module.exports.CreateWriteStreamOptions = CreateWriteStreamOptions;

const CryptoBoxFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cryptobox_free(ptr >>> 0, 1));
/**
 *
 * CryptoBox allows for encrypting and decrypting messages using the `crypto_box` crate.
 *
 * <https://docs.rs/crypto_box/0.9.1/crypto_box/>
 *
 *  @category Wallet SDK
 */
class CryptoBox {

    toJSON() {
        return {
            publicKey: this.publicKey,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CryptoBoxFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cryptobox_free(ptr, 0);
    }
    /**
     * @param {CryptoBoxPrivateKey | HexString | Uint8Array} secretKey
     * @param {CryptoBoxPublicKey | HexString | Uint8Array} peerPublicKey
     */
    constructor(secretKey, peerPublicKey) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.cryptobox_ctor(retptr, addBorrowedObject(secretKey), addBorrowedObject(peerPublicKey));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            CryptoBoxFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {string}
     */
    get publicKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.cryptobox_publicKey(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} plaintext
     * @returns {string}
     */
    encrypt(plaintext) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(plaintext, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.cryptobox_encrypt(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * @param {string} base64string
     * @returns {string}
     */
    decrypt(base64string) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(base64string, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.cryptobox_decrypt(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred3_0, deferred3_1, 1);
        }
    }
}
module.exports.CryptoBox = CryptoBox;

const CryptoBoxPrivateKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cryptoboxprivatekey_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
class CryptoBoxPrivateKey {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CryptoBoxPrivateKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cryptoboxprivatekey_free(ptr, 0);
    }
    /**
     * @param {HexString | Uint8Array} secretKey
     */
    constructor(secretKey) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.cryptoboxprivatekey_ctor(retptr, addHeapObject(secretKey));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            CryptoBoxPrivateKeyFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {CryptoBoxPublicKey}
     */
    to_public_key() {
        const ret = wasm.cryptoboxprivatekey_to_public_key(this.__wbg_ptr);
        return CryptoBoxPublicKey.__wrap(ret);
    }
}
module.exports.CryptoBoxPrivateKey = CryptoBoxPrivateKey;

const CryptoBoxPublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cryptoboxpublickey_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
class CryptoBoxPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CryptoBoxPublicKey.prototype);
        obj.__wbg_ptr = ptr;
        CryptoBoxPublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CryptoBoxPublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cryptoboxpublickey_free(ptr, 0);
    }
    /**
     * @param {HexString | Uint8Array} publicKey
     */
    constructor(publicKey) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.cryptoboxpublickey_ctor(retptr, addHeapObject(publicKey));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            CryptoBoxPublicKeyFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.cryptoboxpublickey_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.CryptoBoxPublicKey = CryptoBoxPublicKey;

const DerivationPathFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_derivationpath_free(ptr >>> 0, 1));
/**
 *
 * Key derivation path
 *
 * @category Wallet SDK
 */
class DerivationPath {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DerivationPath.prototype);
        obj.__wbg_ptr = ptr;
        DerivationPathFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DerivationPathFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_derivationpath_free(ptr, 0);
    }
    /**
     * @param {string} path
     */
    constructor(path) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.derivationpath_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            DerivationPathFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Is this derivation path empty? (i.e. the root)
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.derivationpath_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get the count of [`ChildNumber`] values in this derivation path.
     * @returns {number}
     */
    length() {
        const ret = wasm.derivationpath_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the parent [`DerivationPath`] for the current one.
     *
     * Returns `Undefined` if this is already the root path.
     * @returns {DerivationPath | undefined}
     */
    parent() {
        const ret = wasm.derivationpath_parent(this.__wbg_ptr);
        return ret === 0 ? undefined : DerivationPath.__wrap(ret);
    }
    /**
     * Push a [`ChildNumber`] onto an existing derivation path.
     * @param {number} child_number
     * @param {boolean | null} [hardened]
     */
    push(child_number, hardened) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.derivationpath_push(retptr, this.__wbg_ptr, child_number, isLikeNone(hardened) ? 0xFFFFFF : hardened ? 1 : 0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.derivationpath_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.DerivationPath = DerivationPath;

const FormatInputPathObjectFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_formatinputpathobject_free(ptr >>> 0, 1));

class FormatInputPathObject {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FormatInputPathObject.prototype);
        obj.__wbg_ptr = ptr;
        FormatInputPathObjectFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FormatInputPathObjectFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_formatinputpathobject_free(ptr, 0);
    }
    /**
     * @param {string | null} [base]
     * @param {string | null} [dir]
     * @param {string | null} [ext]
     * @param {string | null} [name]
     * @param {string | null} [root]
     */
    constructor(base, dir, ext, name, root) {
        const ret = wasm.formatinputpathobject_new_with_values(isLikeNone(base) ? 0 : addHeapObject(base), isLikeNone(dir) ? 0 : addHeapObject(dir), isLikeNone(ext) ? 0 : addHeapObject(ext), isLikeNone(name) ? 0 : addHeapObject(name), isLikeNone(root) ? 0 : addHeapObject(root));
        this.__wbg_ptr = ret >>> 0;
        FormatInputPathObjectFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {FormatInputPathObject}
     */
    static new() {
        const ret = wasm.formatinputpathobject_new();
        return FormatInputPathObject.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get base() {
        const ret = wasm.formatinputpathobject_base(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set base(value) {
        wasm.formatinputpathobject_set_base(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {string | undefined}
     */
    get dir() {
        const ret = wasm.formatinputpathobject_dir(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set dir(value) {
        wasm.formatinputpathobject_set_dir(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {string | undefined}
     */
    get ext() {
        const ret = wasm.formatinputpathobject_ext(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set ext(value) {
        wasm.formatinputpathobject_set_ext(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {string | undefined}
     */
    get name() {
        const ret = wasm.formatinputpathobject_name(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set name(value) {
        wasm.formatinputpathobject_set_name(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {string | undefined}
     */
    get root() {
        const ret = wasm.formatinputpathobject_root(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set root(value) {
        wasm.formatinputpathobject_set_root(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
}
module.exports.FormatInputPathObject = FormatInputPathObject;

const GeneratorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_generator_free(ptr >>> 0, 1));
/**
 * Generator is a type capable of generating transactions based on a supplied
 * set of UTXO entries or a UTXO entry producer (such as {@link UtxoContext}). The Generator
 * accumulates UTXO entries until it can generate a transaction that meets the
 * requested amount or until the total mass of created inputs exceeds the allowed
 * transaction mass, at which point it will produce a compound transaction by forwarding
 * all selected UTXO entries to the supplied change address and prepare to start generating
 * a new transaction.  Such sequence of daisy-chained transactions is known as a "batch".
 * Each compound transaction results in a new UTXO, which is immediately reused in the
 * subsequent transaction.
 *
 * The Generator constructor accepts a single {@link IGeneratorSettingsObject} object.
 *
 * ```javascript
 *
 * let generator = new Generator({
 *     utxoEntries : [...],
 *     changeAddress : "kaspa:...",
 *     outputs : [
 *         { amount : kaspaToSompi(10.0), address: "kaspa:..."},
 *         { amount : kaspaToSompi(20.0), address: "kaspa:..."},
 *         ...
 *     ],
 *     priorityFee : 1000n,
 * });
 *
 * let pendingTransaction;
 * while(pendingTransaction = await generator.next()) {
 *     await pendingTransaction.sign(privateKeys);
 *     await pendingTransaction.submit(rpc);
 * }
 *
 * let summary = generator.summary();
 * console.log(summary);
 *
 * ```
 * @see
 *     {@link IGeneratorSettingsObject},
 *     {@link PendingTransaction},
 *     {@link UtxoContext},
 *     {@link createTransactions},
 *     {@link estimateTransactions},
 * @category Wallet SDK
 */
class Generator {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GeneratorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_generator_free(ptr, 0);
    }
    /**
     * @param {IGeneratorSettingsObject} args
     */
    constructor(args) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.generator_ctor(retptr, addHeapObject(args));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            GeneratorFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate next transaction
     * @returns {Promise<any>}
     */
    next() {
        const ret = wasm.generator_next(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<GeneratorSummary>}
     */
    estimate() {
        const ret = wasm.generator_estimate(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {GeneratorSummary}
     */
    summary() {
        const ret = wasm.generator_summary(this.__wbg_ptr);
        return GeneratorSummary.__wrap(ret);
    }
}
module.exports.Generator = Generator;

const GeneratorSummaryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_generatorsummary_free(ptr >>> 0, 1));
/**
 *
 * A class containing a summary produced by transaction {@link Generator}.
 * This class contains the number of transactions, the aggregated fees,
 * the aggregated UTXOs and the final transaction amount that includes
 * both network and QoS (priority) fees.
 *
 * @see {@link createTransactions}, {@link IGeneratorSettingsObject}, {@link Generator}
 * @category Wallet SDK
 */
class GeneratorSummary {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GeneratorSummary.prototype);
        obj.__wbg_ptr = ptr;
        GeneratorSummaryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            networkType: this.networkType,
            utxos: this.utxos,
            fees: this.fees,
            mass: this.mass,
            transactions: this.transactions,
            finalAmount: this.finalAmount,
            finalTransactionId: this.finalTransactionId,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GeneratorSummaryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_generatorsummary_free(ptr, 0);
    }
    /**
     * @returns {NetworkType}
     */
    get networkType() {
        const ret = wasm.generatorsummary_networkType(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get utxos() {
        const ret = wasm.generatorsummary_utxos(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {bigint}
     */
    get fees() {
        const ret = wasm.generatorsummary_fees(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {bigint}
     */
    get mass() {
        const ret = wasm.generatorsummary_mass(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {number}
     */
    get transactions() {
        const ret = wasm.generatorsummary_transactions(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {bigint | undefined}
     */
    get finalAmount() {
        const ret = wasm.generatorsummary_finalAmount(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get finalTransactionId() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.generatorsummary_finalTransactionId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.GeneratorSummary = GeneratorSummary;

const GetNameOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_getnameoptions_free(ptr >>> 0, 1));

class GetNameOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GetNameOptions.prototype);
        obj.__wbg_ptr = ptr;
        GetNameOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GetNameOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_getnameoptions_free(ptr, 0);
    }
    /**
     * @param {number | null | undefined} family
     * @param {string} host
     * @param {string} local_address
     * @param {number} port
     * @returns {GetNameOptions}
     */
    static new(family, host, local_address, port) {
        const ret = wasm.getnameoptions_new(isLikeNone(family) ? 0xFFFFFF : family, addHeapObject(host), addHeapObject(local_address), port);
        return GetNameOptions.__wrap(ret);
    }
    /**
     * @returns {number | undefined}
     */
    get family() {
        const ret = wasm.getnameoptions_family(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number | null} [value]
     */
    set family(value) {
        wasm.getnameoptions_set_family(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value);
    }
    /**
     * @returns {string}
     */
    get host() {
        const ret = wasm.getnameoptions_host(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string} value
     */
    set host(value) {
        wasm.getnameoptions_set_host(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {string}
     */
    get local_address() {
        const ret = wasm.getnameoptions_local_address(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string} value
     */
    set local_address(value) {
        wasm.getnameoptions_set_local_address(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {number}
     */
    get port() {
        const ret = wasm.getnameoptions_port(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} value
     */
    set port(value) {
        wasm.getnameoptions_set_port(this.__wbg_ptr, value);
    }
}
module.exports.GetNameOptions = GetNameOptions;

const HashFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hash_free(ptr >>> 0, 1));
/**
 * @category General
 */
class Hash {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Hash.prototype);
        obj.__wbg_ptr = ptr;
        HashFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HashFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hash_free(ptr, 0);
    }
    /**
     * @param {string} hex_str
     */
    constructor(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hash_constructor(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        HashFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hash_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.Hash = Hash;

const HeaderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_header_free(ptr >>> 0, 1));
/**
 * Kaspa Block Header
 *
 * @category Consensus
 */
class Header {

    toJSON() {
        return {
            version: this.version,
            timestamp: this.timestamp,
            bits: this.bits,
            nonce: this.nonce,
            daaScore: this.daaScore,
            blueScore: this.blueScore,
            hash: this.hash,
            hashMerkleRoot: this.hashMerkleRoot,
            acceptedIdMerkleRoot: this.acceptedIdMerkleRoot,
            utxoCommitment: this.utxoCommitment,
            pruningPoint: this.pruningPoint,
            parentsByLevel: this.parentsByLevel,
            blueWork: this.blueWork,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HeaderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_header_free(ptr, 0);
    }
    /**
     * @param {Header | IHeader | IRawHeader} js_value
     */
    constructor(js_value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.header_constructor(retptr, addHeapObject(js_value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            HeaderFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Finalizes the header and recomputes (updates) the header hash
     * @return { String } header hash
     * @returns {string}
     */
    finalize() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.header_finalize(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Obtain `JSON` representation of the header. JSON representation
     * should be obtained using WASM, to ensure proper serialization of
     * big integers.
     * @returns {string}
     */
    asJSON() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.header_asJSON(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get version() {
        const ret = wasm.header_get_version(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} version
     */
    set version(version) {
        wasm.header_set_version(this.__wbg_ptr, version);
    }
    /**
     * @returns {bigint}
     */
    get timestamp() {
        const ret = wasm.header_get_timestamp(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} timestamp
     */
    set timestamp(timestamp) {
        wasm.header_set_timestamp(this.__wbg_ptr, timestamp);
    }
    /**
     * @returns {number}
     */
    get bits() {
        const ret = wasm.header_bits(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} bits
     */
    set bits(bits) {
        wasm.header_set_bits(this.__wbg_ptr, bits);
    }
    /**
     * @returns {bigint}
     */
    get nonce() {
        const ret = wasm.header_nonce(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} nonce
     */
    set nonce(nonce) {
        wasm.header_set_nonce(this.__wbg_ptr, nonce);
    }
    /**
     * @returns {bigint}
     */
    get daaScore() {
        const ret = wasm.header_daa_score(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} daa_score
     */
    set daaScore(daa_score) {
        wasm.header_set_daa_score(this.__wbg_ptr, daa_score);
    }
    /**
     * @returns {bigint}
     */
    get blueScore() {
        const ret = wasm.header_blue_score(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} blue_score
     */
    set blueScore(blue_score) {
        wasm.header_set_blue_score(this.__wbg_ptr, blue_score);
    }
    /**
     * @returns {string}
     */
    get hash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.header_get_hash_as_hex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get hashMerkleRoot() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.header_get_hash_merkle_root_as_hex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} js_value
     */
    set hashMerkleRoot(js_value) {
        wasm.header_set_hash_merkle_root_from_js_value(this.__wbg_ptr, addHeapObject(js_value));
    }
    /**
     * @returns {string}
     */
    get acceptedIdMerkleRoot() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.header_get_accepted_id_merkle_root_as_hex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} js_value
     */
    set acceptedIdMerkleRoot(js_value) {
        wasm.header_set_accepted_id_merkle_root_from_js_value(this.__wbg_ptr, addHeapObject(js_value));
    }
    /**
     * @returns {string}
     */
    get utxoCommitment() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.header_get_utxo_commitment_as_hex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} js_value
     */
    set utxoCommitment(js_value) {
        wasm.header_set_utxo_commitment_from_js_value(this.__wbg_ptr, addHeapObject(js_value));
    }
    /**
     * @returns {string}
     */
    get pruningPoint() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.header_get_pruning_point_as_hex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} js_value
     */
    set pruningPoint(js_value) {
        wasm.header_set_pruning_point_from_js_value(this.__wbg_ptr, addHeapObject(js_value));
    }
    /**
     * @returns {any}
     */
    get parentsByLevel() {
        const ret = wasm.header_get_parents_by_level_as_js_value(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {any} js_value
     */
    set parentsByLevel(js_value) {
        wasm.header_set_parents_by_level_from_js_value(this.__wbg_ptr, addHeapObject(js_value));
    }
    /**
     * @returns {bigint}
     */
    get blueWork() {
        const ret = wasm.header_blue_work(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {string}
     */
    getBlueWorkAsHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.header_getBlueWorkAsHex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} js_value
     */
    set blueWork(js_value) {
        wasm.header_set_blue_work_from_js_value(this.__wbg_ptr, addHeapObject(js_value));
    }
}
module.exports.Header = Header;

const KeypairFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_keypair_free(ptr >>> 0, 1));
/**
 * Data structure that contains a secret and public keys.
 * @category Wallet SDK
 */
class Keypair {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Keypair.prototype);
        obj.__wbg_ptr = ptr;
        KeypairFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            publicKey: this.publicKey,
            privateKey: this.privateKey,
            xOnlyPublicKey: this.xOnlyPublicKey,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KeypairFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keypair_free(ptr, 0);
    }
    /**
     * Get the [`PublicKey`] of this [`Keypair`].
     * @returns {string}
     */
    get publicKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keypair_get_public_key(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the [`PrivateKey`] of this [`Keypair`].
     * @returns {string}
     */
    get privateKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keypair_get_private_key(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the `XOnlyPublicKey` of this [`Keypair`].
     * @returns {any}
     */
    get xOnlyPublicKey() {
        const ret = wasm.keypair_get_xonly_public_key(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Get the [`Address`] of this Keypair's [`PublicKey`].
     * Receives a [`NetworkType`](kaspa_consensus_core::network::NetworkType)
     * to determine the prefix of the address.
     * JavaScript: `let address = keypair.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddress(network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keypair_toAddress(retptr, this.__wbg_ptr, addBorrowedObject(network));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Get `ECDSA` [`Address`] of this Keypair's [`PublicKey`].
     * Receives a [`NetworkType`](kaspa_consensus_core::network::NetworkType)
     * to determine the prefix of the address.
     * JavaScript: `let address = keypair.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddressECDSA(network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keypair_toAddressECDSA(retptr, this.__wbg_ptr, addBorrowedObject(network));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Create a new random [`Keypair`].
     * JavaScript: `let keypair = Keypair::random();`.
     * @returns {Keypair}
     */
    static random() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keypair_random(retptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Keypair.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create a new [`Keypair`] from a [`PrivateKey`].
     * JavaScript: `let privkey = new PrivateKey(hexString); let keypair = privkey.toKeypair();`.
     * @param {PrivateKey} secret_key
     * @returns {Keypair}
     */
    static fromPrivateKey(secret_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(secret_key, PrivateKey);
            wasm.keypair_fromPrivateKey(retptr, secret_key.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Keypair.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.Keypair = Keypair;

const MkdtempSyncOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_mkdtempsyncoptions_free(ptr >>> 0, 1));

class MkdtempSyncOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MkdtempSyncOptions.prototype);
        obj.__wbg_ptr = ptr;
        MkdtempSyncOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MkdtempSyncOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mkdtempsyncoptions_free(ptr, 0);
    }
    /**
     * @param {string | null} [encoding]
     */
    constructor(encoding) {
        const ret = wasm.mkdtempsyncoptions_new_with_values(isLikeNone(encoding) ? 0 : addHeapObject(encoding));
        this.__wbg_ptr = ret >>> 0;
        MkdtempSyncOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {MkdtempSyncOptions}
     */
    static new() {
        const ret = wasm.mkdtempsyncoptions_new();
        return MkdtempSyncOptions.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.mkdtempsyncoptions_encoding(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.mkdtempsyncoptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
}
module.exports.MkdtempSyncOptions = MkdtempSyncOptions;

const MnemonicFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_mnemonic_free(ptr >>> 0, 1));
/**
 * BIP39 mnemonic phrases: sequences of words representing cryptographic keys.
 * @category Wallet SDK
 */
class Mnemonic {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Mnemonic.prototype);
        obj.__wbg_ptr = ptr;
        MnemonicFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            entropy: this.entropy,
            phrase: this.phrase,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MnemonicFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mnemonic_free(ptr, 0);
    }
    /**
     * @param {string} phrase
     * @param {Language | null} [language]
     */
    constructor(phrase, language) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.mnemonic_constructor(retptr, ptr0, len0, isLikeNone(language) ? 1 : language);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            MnemonicFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Validate mnemonic phrase. Returns `true` if the phrase is valid, `false` otherwise.
     * @param {string} phrase
     * @param {Language | null} [language]
     * @returns {boolean}
     */
    static validate(phrase, language) {
        const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.mnemonic_validate(ptr0, len0, isLikeNone(language) ? 1 : language);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    get entropy() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.mnemonic_entropy(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} entropy
     */
    set entropy(entropy) {
        const ptr0 = passStringToWasm0(entropy, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.mnemonic_set_entropy(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number | null} [word_count]
     * @returns {Mnemonic}
     */
    static random(word_count) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.mnemonic_random(retptr, isLikeNone(word_count) ? 0x100000001 : (word_count) >>> 0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Mnemonic.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    get phrase() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.mnemonic_phrase(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} phrase
     */
    set phrase(phrase) {
        const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.mnemonic_set_phrase(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [password]
     * @returns {string}
     */
    toSeed(password) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = isLikeNone(password) ? 0 : passStringToWasm0(password, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            var len0 = WASM_VECTOR_LEN;
            wasm.mnemonic_toSeed(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred2_0 = r0;
            deferred2_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
}
module.exports.Mnemonic = Mnemonic;

const NetServerOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_netserveroptions_free(ptr >>> 0, 1));

class NetServerOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NetServerOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_netserveroptions_free(ptr, 0);
    }
    /**
     * @returns {boolean | undefined}
     */
    get allow_half_open() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.netserveroptions_allow_half_open(ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [value]
     */
    set allow_half_open(value) {
        const ptr = this.__destroy_into_raw();
        wasm.netserveroptions_set_allow_half_open(ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {boolean | undefined}
     */
    get pause_on_connect() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.netserveroptions_pause_on_connect(ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [value]
     */
    set pause_on_connect(value) {
        const ptr = this.__destroy_into_raw();
        wasm.netserveroptions_set_allow_half_open(ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
}
module.exports.NetServerOptions = NetServerOptions;

const NetworkIdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_networkid_free(ptr >>> 0, 1));
/**
 *
 * NetworkId is a unique identifier for a kaspa network instance.
 * It is composed of a network type and an optional suffix.
 *
 * @category Consensus
 */
class NetworkId {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NetworkId.prototype);
        obj.__wbg_ptr = ptr;
        NetworkIdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            type: this.type,
            suffix: this.suffix,
            id: this.id,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NetworkIdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_networkid_free(ptr, 0);
    }
    /**
     * @returns {NetworkType}
     */
    get type() {
        const ret = wasm.__wbg_get_networkid_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {NetworkType} arg0
     */
    set type(arg0) {
        wasm.__wbg_set_networkid_type(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number | undefined}
     */
    get suffix() {
        const ret = wasm.__wbg_get_networkid_suffix(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number | null} [arg0]
     */
    set suffix(arg0) {
        wasm.__wbg_set_networkid_suffix(this.__wbg_ptr, isLikeNone(arg0) ? 0x100000001 : (arg0) >>> 0);
    }
    /**
     * @param {any} value
     */
    constructor(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.networkid_ctor(retptr, addBorrowedObject(value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            NetworkIdFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.networkid_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.networkid_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    addressPrefix() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.networkid_addressPrefix(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.NetworkId = NetworkId;

const NodeDescriptorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nodedescriptor_free(ptr >>> 0, 1));
/**
 *
 * Data structure representing a Node connection endpoint
 * as provided by the {@link Resolver}.
 *
 * @category Node RPC
 */
class NodeDescriptor {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NodeDescriptor.prototype);
        obj.__wbg_ptr = ptr;
        NodeDescriptorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            uid: this.uid,
            url: this.url,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NodeDescriptorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nodedescriptor_free(ptr, 0);
    }
    /**
     * The unique identifier of the node.
     * @returns {string}
     */
    get uid() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_nodedescriptor_uid(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The unique identifier of the node.
     * @param {string} arg0
     */
    set uid(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_nodedescriptor_uid(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The URL of the node WebSocket (wRPC URL).
     * @returns {string}
     */
    get url() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_nodedescriptor_url(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The URL of the node WebSocket (wRPC URL).
     * @param {string} arg0
     */
    set url(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_nodedescriptor_url(this.__wbg_ptr, ptr0, len0);
    }
}
module.exports.NodeDescriptor = NodeDescriptor;

const PSKBFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pskb_free(ptr >>> 0, 1));

class PSKB {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PSKB.prototype);
        obj.__wbg_ptr = ptr;
        PSKBFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PSKBFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pskb_free(ptr, 0);
    }
    constructor() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskb_new(retptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PSKBFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    serialize() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskb_serialize(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {NetworkId | string} network_id
     * @returns {string}
     */
    displayFormat(network_id) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskb_displayFormat(retptr, this.__wbg_ptr, addBorrowedObject(network_id));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string} hex_data
     * @returns {PSKB}
     */
    static deserialize(hex_data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(hex_data, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.pskb_deserialize(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKB.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number}
     */
    get length() {
        const ret = wasm.pskb_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {PSKT} pskt
     */
    add(pskt) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(pskt, PSKT);
            wasm.pskb_add(retptr, this.__wbg_ptr, pskt.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {PSKB} other
     */
    merge(other) {
        _assertClass(other, PSKB);
        wasm.pskb_merge(this.__wbg_ptr, other.__wbg_ptr);
    }
}
module.exports.PSKB = PSKB;

const PSKTFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pskt_free(ptr >>> 0, 1));

class PSKT {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PSKT.prototype);
        obj.__wbg_ptr = ptr;
        PSKTFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            role: this.role,
            payload: this.payload,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PSKTFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pskt_free(ptr, 0);
    }
    /**
     * @param {PSKT | Transaction | string | undefined} payload
     */
    constructor(payload) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_new(retptr, addHeapObject(payload));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PSKTFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    get role() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_role(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    get payload() {
        const ret = wasm.pskt_payload(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {string}
     */
    serialize() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_serialize(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Change role to `CREATOR`
     * #[wasm_bindgen(js_name = toCreator)]
     * @returns {PSKT}
     */
    creator() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_creator(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Change role to `CONSTRUCTOR`
     * @returns {PSKT}
     */
    toConstructor() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_toConstructor(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Change role to `UPDATER`
     * @returns {PSKT}
     */
    toUpdater() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_toUpdater(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Change role to `SIGNER`
     * @returns {PSKT}
     */
    toSigner() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_toSigner(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Change role to `COMBINER`
     * @returns {PSKT}
     */
    toCombiner() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_toCombiner(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Change role to `FINALIZER`
     * @returns {PSKT}
     */
    toFinalizer() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_toFinalizer(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Change role to `EXTRACTOR`
     * @returns {PSKT}
     */
    toExtractor() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_toExtractor(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} lock_time
     * @returns {PSKT}
     */
    fallbackLockTime(lock_time) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_fallbackLockTime(retptr, this.__wbg_ptr, lock_time);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {PSKT}
     */
    inputsModifiable() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_inputsModifiable(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {PSKT}
     */
    outputsModifiable() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_outputsModifiable(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {PSKT}
     */
    noMoreInputs() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_noMoreInputs(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {PSKT}
     */
    noMoreOutputs() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_noMoreOutputs(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {ITransactionInput | TransactionInput} input
     * @param {any} data
     * @returns {PSKT}
     */
    inputAndRedeemScript(input, data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_inputAndRedeemScript(retptr, this.__wbg_ptr, addBorrowedObject(input), addBorrowedObject(data));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {ITransactionInput | TransactionInput} input
     * @returns {PSKT}
     */
    input(input) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_input(retptr, this.__wbg_ptr, addBorrowedObject(input));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {ITransactionOutput | TransactionOutput} output
     * @returns {PSKT}
     */
    output(output) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_output(retptr, this.__wbg_ptr, addBorrowedObject(output));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {bigint} n
     * @param {number} input_index
     * @returns {PSKT}
     */
    setSequence(n, input_index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_setSequence(retptr, this.__wbg_ptr, n, input_index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PSKT.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Hash}
     */
    calculateId() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_calculateId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Hash.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} data
     * @returns {bigint}
     */
    calculateMass(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pskt_calculateMass(retptr, this.__wbg_ptr, addBorrowedObject(data));
            var r0 = getDataViewMemory0().getBigInt64(retptr + 8 * 0, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.PSKT = PSKT;

const PaymentOutputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_paymentoutput_free(ptr >>> 0, 1));
/**
 * A Rust data structure representing a single payment
 * output containing a destination address and amount.
 *
 * @category Wallet SDK
 */
class PaymentOutput {

    toJSON() {
        return {
            address: this.address,
            amount: this.amount,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PaymentOutputFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_paymentoutput_free(ptr, 0);
    }
    /**
     * @returns {Address}
     */
    get address() {
        const ret = wasm.__wbg_get_paymentoutput_address(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} arg0
     */
    set address(arg0) {
        _assertClass(arg0, Address);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_paymentoutput_address(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.__wbg_get_paymentoutput_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set amount(arg0) {
        wasm.__wbg_set_paymentoutput_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Address} address
     * @param {bigint} amount
     */
    constructor(address, amount) {
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.paymentoutput_new(ptr0, amount);
        this.__wbg_ptr = ret >>> 0;
        PaymentOutputFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
module.exports.PaymentOutput = PaymentOutput;

const PaymentOutputsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_paymentoutputs_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
class PaymentOutputs {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PaymentOutputsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_paymentoutputs_free(ptr, 0);
    }
    /**
     * @param {IPaymentOutput[]} output_array
     */
    constructor(output_array) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paymentoutputs_constructor(retptr, addHeapObject(output_array));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PaymentOutputsFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.PaymentOutputs = PaymentOutputs;

const PendingTransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pendingtransaction_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
class PendingTransaction {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PendingTransaction.prototype);
        obj.__wbg_ptr = ptr;
        PendingTransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            id: this.id,
            paymentAmount: this.paymentAmount,
            changeAmount: this.changeAmount,
            feeAmount: this.feeAmount,
            mass: this.mass,
            minimumSignatures: this.minimumSignatures,
            aggregateInputAmount: this.aggregateInputAmount,
            aggregateOutputAmount: this.aggregateOutputAmount,
            type: this.type,
            transaction: this.transaction,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PendingTransactionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pendingtransaction_free(ptr, 0);
    }
    /**
     * Transaction Id
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pendingtransaction_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Total amount transferred to the destination (aggregate output - change).
     * @returns {any}
     */
    get paymentAmount() {
        const ret = wasm.pendingtransaction_paymentAmount(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Change amount (if any).
     * @returns {bigint}
     */
    get changeAmount() {
        const ret = wasm.pendingtransaction_changeAmount(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Total transaction fees (network fees + priority fees).
     * @returns {bigint}
     */
    get feeAmount() {
        const ret = wasm.pendingtransaction_feeAmount(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Calculated transaction mass.
     * @returns {bigint}
     */
    get mass() {
        const ret = wasm.pendingtransaction_mass(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Minimum number of signatures required by the transaction.
     * (as specified during the transaction creation).
     * @returns {number}
     */
    get minimumSignatures() {
        const ret = wasm.pendingtransaction_minimumSignatures(this.__wbg_ptr);
        return ret;
    }
    /**
     * Total aggregate input amount.
     * @returns {bigint}
     */
    get aggregateInputAmount() {
        const ret = wasm.pendingtransaction_aggregateInputAmount(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Total aggregate output amount.
     * @returns {bigint}
     */
    get aggregateOutputAmount() {
        const ret = wasm.pendingtransaction_aggregateOutputAmount(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Transaction type ("batch" or "final").
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pendingtransaction_type(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * List of unique addresses used by transaction inputs.
     * This method can be used to determine addresses used by transaction inputs
     * in order to select private keys needed for transaction signing.
     * @returns {Array<any>}
     */
    addresses() {
        const ret = wasm.pendingtransaction_addresses(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Provides a list of UTXO entries used by the transaction.
     * @returns {Array<any>}
     */
    getUtxoEntries() {
        const ret = wasm.pendingtransaction_getUtxoEntries(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Creates and returns a signature for the input at the specified index.
     * @param {number} input_index
     * @param {PrivateKey} private_key
     * @param {SighashType | null} [sighash_type]
     * @returns {HexString}
     */
    createInputSignature(input_index, private_key, sighash_type) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(private_key, PrivateKey);
            wasm.pendingtransaction_createInputSignature(retptr, this.__wbg_ptr, input_index, private_key.__wbg_ptr, isLikeNone(sighash_type) ? 6 : sighash_type);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Sets a signature to the input at the specified index.
     * @param {number} input_index
     * @param {HexString | Uint8Array} signature_script
     */
    fillInput(input_index, signature_script) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pendingtransaction_fillInput(retptr, this.__wbg_ptr, input_index, addHeapObject(signature_script));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Signs the input at the specified index with the supplied private key
     * and an optional SighashType.
     * @param {number} input_index
     * @param {PrivateKey} private_key
     * @param {SighashType | null} [sighash_type]
     */
    signInput(input_index, private_key, sighash_type) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(private_key, PrivateKey);
            wasm.pendingtransaction_signInput(retptr, this.__wbg_ptr, input_index, private_key.__wbg_ptr, isLikeNone(sighash_type) ? 6 : sighash_type);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Signs transaction with supplied [`Array`] or [`PrivateKey`] or an array of
     * raw private key bytes (encoded as `Uint8Array` or as hex strings)
     * @param {(PrivateKey | HexString | Uint8Array)[]} js_value
     * @param {boolean | null} [check_fully_signed]
     */
    sign(js_value, check_fully_signed) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pendingtransaction_sign(retptr, this.__wbg_ptr, addHeapObject(js_value), isLikeNone(check_fully_signed) ? 0xFFFFFF : check_fully_signed ? 1 : 0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Submit transaction to the supplied [`RpcClient`]
     * **IMPORTANT:** This method will remove UTXOs from the associated
     * {@link UtxoContext} if one was used to create the transaction
     * and will return UTXOs back to {@link UtxoContext} in case of
     * a failed submission.
     *
     * # Important
     *
     * Make sure to consume the returned `txid` value. Always invoke this method
     * as follows `let txid = await pendingTransaction.submit(rpc);`. If you do not
     * consume the returned value and the rpc object is temporary, the GC will
     * collect the `rpc` object passed to submit() potentially causing a panic.
     *
     * @see {@link RpcClient.submitTransaction}
     * @param {RpcClient} wasm_rpc_client
     * @returns {Promise<string>}
     */
    submit(wasm_rpc_client) {
        _assertClass(wasm_rpc_client, RpcClient);
        const ret = wasm.pendingtransaction_submit(this.__wbg_ptr, wasm_rpc_client.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Returns encapsulated network [`Transaction`]
     * @returns {Transaction}
     */
    get transaction() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pendingtransaction_transaction(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Transaction.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Serializes the transaction to a pure JavaScript Object.
     * The schema of the JavaScript object is defined by {@link ISerializableTransaction}.
     * @see {@link ISerializableTransaction}
     * @see {@link Transaction}, {@link ISerializableTransaction}
     * @returns {ITransaction | Transaction}
     */
    serializeToObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pendingtransaction_serializeToObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Serializes the transaction to a JSON string.
     * The schema of the JSON is defined by {@link ISerializableTransaction}.
     * Once serialized, the transaction can be deserialized using {@link Transaction.deserializeFromJSON}.
     * @see {@link Transaction}, {@link ISerializableTransaction}
     * @returns {string}
     */
    serializeToJSON() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pendingtransaction_serializeToJSON(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Serializes the transaction to a "Safe" JSON schema where it converts all `bigint` values to `string` to avoid potential client-side precision loss.
     * Once serialized, the transaction can be deserialized using {@link Transaction.deserializeFromSafeJSON}.
     * @see {@link Transaction}, {@link ISerializableTransaction}
     * @returns {string}
     */
    serializeToSafeJSON() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pendingtransaction_serializeToSafeJSON(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
}
module.exports.PendingTransaction = PendingTransaction;

const PipeOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pipeoptions_free(ptr >>> 0, 1));

class PipeOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PipeOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pipeoptions_free(ptr, 0);
    }
    /**
     * @param {boolean | null} [end]
     */
    constructor(end) {
        const ret = wasm.pipeoptions_new(isLikeNone(end) ? 0xFFFFFF : end ? 1 : 0);
        this.__wbg_ptr = ret >>> 0;
        PipeOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {boolean | undefined}
     */
    get end() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.pipeoptions_end(ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [value]
     */
    set end(value) {
        const ptr = this.__destroy_into_raw();
        wasm.pipeoptions_set_end(ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
}
module.exports.PipeOptions = PipeOptions;

const PoWFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pow_free(ptr >>> 0, 1));
/**
 * Represents a Kaspa header PoW manager
 * @category Mining
 */
class PoW {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PoW.prototype);
        obj.__wbg_ptr = ptr;
        PoWFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            target: this.target,
            prePoWHash: this.prePoWHash,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PoWFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pow_free(ptr, 0);
    }
    /**
     * @param {Header | IHeader | IRawHeader} header
     * @param {bigint | null} [timestamp]
     */
    constructor(header, timestamp) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pow_new(retptr, addBorrowedObject(header), !isLikeNone(timestamp), isLikeNone(timestamp) ? BigInt(0) : timestamp);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PoWFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * The target based on the provided bits.
     * @returns {bigint}
     */
    get target() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pow_target(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Checks if the computed target meets or exceeds the difficulty specified in the template.
     * @returns A boolean indicating if it reached the target and a bigint representing the reached target.
     * @param {bigint} nonce
     * @returns {[boolean, bigint]}
     */
    checkWork(nonce) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pow_checkWork(retptr, this.__wbg_ptr, nonce);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Hash of the header without timestamp and nonce.
     * @returns {string}
     */
    get prePoWHash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pow_get_pre_pow_hash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Can be used for parsing Stratum templates.
     * @param {string} pre_pow_hash
     * @param {bigint} timestamp
     * @param {number | null} [target_bits]
     * @returns {PoW}
     */
    static fromRaw(pre_pow_hash, timestamp, target_bits) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(pre_pow_hash, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.pow_fromRaw(retptr, ptr0, len0, timestamp, isLikeNone(target_bits) ? 0x100000001 : (target_bits) >>> 0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PoW.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.PoW = PoW;

const PrivateKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_privatekey_free(ptr >>> 0, 1));
/**
 * Data structure that envelops a Private Key.
 * @category Wallet SDK
 */
class PrivateKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PrivateKey.prototype);
        obj.__wbg_ptr = ptr;
        PrivateKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrivateKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_privatekey_free(ptr, 0);
    }
    /**
     * Create a new [`PrivateKey`] from a hex-encoded string.
     * @param {string} key
     */
    constructor(key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(key, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.privatekey_try_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PrivateKeyFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Returns the [`PrivateKey`] key encoded as a hex string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.privatekey_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Generate a [`Keypair`] from this [`PrivateKey`].
     * @returns {Keypair}
     */
    toKeypair() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.privatekey_toKeypair(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Keypair.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {PublicKey}
     */
    toPublicKey() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.privatekey_toPublicKey(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the [`Address`] of the PublicKey generated from this PrivateKey.
     * Receives a [`NetworkType`](kaspa_consensus_core::network::NetworkType)
     * to determine the prefix of the address.
     * JavaScript: `let address = privateKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddress(network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.privatekey_toAddress(retptr, this.__wbg_ptr, addBorrowedObject(network));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Get `ECDSA` [`Address`] of the PublicKey generated from this PrivateKey.
     * Receives a [`NetworkType`](kaspa_consensus_core::network::NetworkType)
     * to determine the prefix of the address.
     * JavaScript: `let address = privateKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddressECDSA(network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.privatekey_toAddressECDSA(retptr, this.__wbg_ptr, addBorrowedObject(network));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.PrivateKey = PrivateKey;

const PrivateKeyGeneratorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_privatekeygenerator_free(ptr >>> 0, 1));
/**
 *
 * Helper class to generate private keys from an extended private key (XPrv).
 * This class accepts the master Kaspa XPrv string (e.g. `xprv1...`) and generates
 * private keys for the receive and change paths given the pre-set parameters
 * such as account index, multisig purpose and cosigner index.
 *
 * Please note that in Kaspa master private keys use `kprv` prefix.
 *
 * @see {@link PublicKeyGenerator}, {@link XPub}, {@link XPrv}, {@link Mnemonic}
 * @category Wallet SDK
 */
class PrivateKeyGenerator {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrivateKeyGeneratorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_privatekeygenerator_free(ptr, 0);
    }
    /**
     * @param {XPrv | string} xprv
     * @param {boolean} is_multisig
     * @param {bigint} account_index
     * @param {number | null} [cosigner_index]
     */
    constructor(xprv, is_multisig, account_index, cosigner_index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.privatekeygenerator_new(retptr, addBorrowedObject(xprv), is_multisig, account_index, isLikeNone(cosigner_index) ? 0x100000001 : (cosigner_index) >>> 0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PrivateKeyGeneratorFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {number} index
     * @returns {PrivateKey}
     */
    receiveKey(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.privatekeygenerator_receiveKey(retptr, this.__wbg_ptr, index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PrivateKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} index
     * @returns {PrivateKey}
     */
    changeKey(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.privatekeygenerator_changeKey(retptr, this.__wbg_ptr, index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PrivateKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.PrivateKeyGenerator = PrivateKeyGenerator;

const ProcessSendOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_processsendoptions_free(ptr >>> 0, 1));

class ProcessSendOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ProcessSendOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_processsendoptions_free(ptr, 0);
    }
    /**
     * @param {boolean | null} [swallow_errors]
     */
    constructor(swallow_errors) {
        const ret = wasm.processsendoptions_new(isLikeNone(swallow_errors) ? 0xFFFFFF : swallow_errors ? 1 : 0);
        this.__wbg_ptr = ret >>> 0;
        ProcessSendOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {boolean | undefined}
     */
    get swallow_errors() {
        const ret = wasm.processsendoptions_swallow_errors(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [value]
     */
    set swallow_errors(value) {
        wasm.processsendoptions_set_swallow_errors(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
}
module.exports.ProcessSendOptions = ProcessSendOptions;

const PrvKeyDataInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_prvkeydatainfo_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
class PrvKeyDataInfo {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrvKeyDataInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_prvkeydatainfo_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.prvkeydatainfo_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    get name() {
        const ret = wasm.prvkeydatainfo_name(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get isEncrypted() {
        const ret = wasm.prvkeydatainfo_isEncrypted(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string} _name
     */
    setName(_name) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(_name, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.prvkeydatainfo_setName(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.PrvKeyDataInfo = PrvKeyDataInfo;

const PublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_publickey_free(ptr >>> 0, 1));
/**
 * Data structure that envelopes a PublicKey.
 * Only supports Schnorr-based addresses.
 * @category Wallet SDK
 */
class PublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PublicKey.prototype);
        obj.__wbg_ptr = ptr;
        PublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publickey_free(ptr, 0);
    }
    /**
     * Create a new [`PublicKey`] from a hex-encoded string.
     * @param {string} key
     */
    constructor(key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(key, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.publickey_try_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            PublicKeyFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the [`Address`] of this PublicKey.
     * Receives a [`NetworkType`] to determine the prefix of the address.
     * JavaScript: `let address = publicKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddress(network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey_toAddress(retptr, this.__wbg_ptr, addBorrowedObject(network));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Get `ECDSA` [`Address`] of this PublicKey.
     * Receives a [`NetworkType`] to determine the prefix of the address.
     * JavaScript: `let address = publicKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddressECDSA(network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey_toAddressECDSA(retptr, this.__wbg_ptr, addBorrowedObject(network));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {XOnlyPublicKey}
     */
    toXOnlyPublicKey() {
        const ret = wasm.publickey_toXOnlyPublicKey(this.__wbg_ptr);
        return XOnlyPublicKey.__wrap(ret);
    }
    /**
     * Compute a 4-byte key fingerprint for this public key as a hex string.
     * Default implementation uses `RIPEMD160(SHA256(public_key))`.
     * @returns {HexString | undefined}
     */
    fingerprint() {
        const ret = wasm.publickey_fingerprint(this.__wbg_ptr);
        return takeObject(ret);
    }
}
module.exports.PublicKey = PublicKey;

const PublicKeyGeneratorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_publickeygenerator_free(ptr >>> 0, 1));
/**
 *
 * Helper class to generate public keys from an extended public key (XPub)
 * that has been derived up to the co-signer index.
 *
 * Please note that in Kaspa master public keys use `kpub` prefix.
 *
 * @see {@link PrivateKeyGenerator}, {@link XPub}, {@link XPrv}, {@link Mnemonic}
 * @category Wallet SDK
 */
class PublicKeyGenerator {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PublicKeyGenerator.prototype);
        obj.__wbg_ptr = ptr;
        PublicKeyGeneratorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PublicKeyGeneratorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publickeygenerator_free(ptr, 0);
    }
    /**
     * @param {XPub | string} kpub
     * @param {number | null} [cosigner_index]
     * @returns {PublicKeyGenerator}
     */
    static fromXPub(kpub, cosigner_index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_fromXPub(retptr, addBorrowedObject(kpub), isLikeNone(cosigner_index) ? 0x100000001 : (cosigner_index) >>> 0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PublicKeyGenerator.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {XPrv | string} xprv
     * @param {boolean} is_multisig
     * @param {bigint} account_index
     * @param {number | null} [cosigner_index]
     * @returns {PublicKeyGenerator}
     */
    static fromMasterXPrv(xprv, is_multisig, account_index, cosigner_index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_fromMasterXPrv(retptr, addBorrowedObject(xprv), is_multisig, account_index, isLikeNone(cosigner_index) ? 0x100000001 : (cosigner_index) >>> 0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PublicKeyGenerator.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Generate Receive Public Key derivations for a given range.
     * @param {number} start
     * @param {number} end
     * @returns {(PublicKey | string)[]}
     */
    receivePubkeys(start, end) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_receivePubkeys(retptr, this.__wbg_ptr, start, end);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate a single Receive Public Key derivation at a given index.
     * @param {number} index
     * @returns {PublicKey}
     */
    receivePubkey(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_receivePubkey(retptr, this.__wbg_ptr, index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate a range of Receive Public Key derivations and return them as strings.
     * @param {number} start
     * @param {number} end
     * @returns {Array<string>}
     */
    receivePubkeysAsStrings(start, end) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_receivePubkeysAsStrings(retptr, this.__wbg_ptr, start, end);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate a single Receive Public Key derivation at a given index and return it as a string.
     * @param {number} index
     * @returns {string}
     */
    receivePubkeyAsString(index) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_receivePubkeyAsString(retptr, this.__wbg_ptr, index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Generate Receive Address derivations for a given range.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} start
     * @param {number} end
     * @returns {Address[]}
     */
    receiveAddresses(networkType, start, end) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_receiveAddresses(retptr, this.__wbg_ptr, addBorrowedObject(networkType), start, end);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Generate a single Receive Address derivation at a given index.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} index
     * @returns {Address}
     */
    receiveAddress(networkType, index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_receiveAddress(retptr, this.__wbg_ptr, addBorrowedObject(networkType), index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Generate a range of Receive Address derivations and return them as strings.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} start
     * @param {number} end
     * @returns {Array<string>}
     */
    receiveAddressAsStrings(networkType, start, end) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_receiveAddressAsStrings(retptr, this.__wbg_ptr, addBorrowedObject(networkType), start, end);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Generate a single Receive Address derivation at a given index and return it as a string.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} index
     * @returns {string}
     */
    receiveAddressAsString(networkType, index) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_receiveAddressAsString(retptr, this.__wbg_ptr, addBorrowedObject(networkType), index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Generate Change Public Key derivations for a given range.
     * @param {number} start
     * @param {number} end
     * @returns {(PublicKey | string)[]}
     */
    changePubkeys(start, end) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_changePubkeys(retptr, this.__wbg_ptr, start, end);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate a single Change Public Key derivation at a given index.
     * @param {number} index
     * @returns {PublicKey}
     */
    changePubkey(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_changePubkey(retptr, this.__wbg_ptr, index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate a range of Change Public Key derivations and return them as strings.
     * @param {number} start
     * @param {number} end
     * @returns {Array<string>}
     */
    changePubkeysAsStrings(start, end) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_changePubkeysAsStrings(retptr, this.__wbg_ptr, start, end);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate a single Change Public Key derivation at a given index and return it as a string.
     * @param {number} index
     * @returns {string}
     */
    changePubkeyAsString(index) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_changePubkeyAsString(retptr, this.__wbg_ptr, index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Generate Change Address derivations for a given range.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} start
     * @param {number} end
     * @returns {Address[]}
     */
    changeAddresses(networkType, start, end) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_changeAddresses(retptr, this.__wbg_ptr, addBorrowedObject(networkType), start, end);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Generate a single Change Address derivation at a given index.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} index
     * @returns {Address}
     */
    changeAddress(networkType, index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_changeAddress(retptr, this.__wbg_ptr, addBorrowedObject(networkType), index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Generate a range of Change Address derivations and return them as strings.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} start
     * @param {number} end
     * @returns {Array<string>}
     */
    changeAddressAsStrings(networkType, start, end) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_changeAddressAsStrings(retptr, this.__wbg_ptr, addBorrowedObject(networkType), start, end);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Generate a single Change Address derivation at a given index and return it as a string.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} index
     * @returns {string}
     */
    changeAddressAsString(networkType, index) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_changeAddressAsString(retptr, this.__wbg_ptr, addBorrowedObject(networkType), index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickeygenerator_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
}
module.exports.PublicKeyGenerator = PublicKeyGenerator;

const ReadStreamFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_readstream_free(ptr >>> 0, 1));

class ReadStream {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReadStreamFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_readstream_free(ptr, 0);
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    add_listener_with_open(listener) {
        try {
            const ret = wasm.readstream_add_listener_with_open(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    add_listener_with_close(listener) {
        try {
            const ret = wasm.readstream_add_listener_with_close(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    on_with_open(listener) {
        try {
            const ret = wasm.readstream_on_with_open(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    on_with_close(listener) {
        try {
            const ret = wasm.readstream_on_with_close(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    once_with_open(listener) {
        try {
            const ret = wasm.readstream_once_with_open(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    once_with_close(listener) {
        try {
            const ret = wasm.readstream_once_with_close(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_listener_with_open(listener) {
        try {
            const ret = wasm.readstream_prepend_listener_with_open(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_listener_with_close(listener) {
        try {
            const ret = wasm.readstream_prepend_listener_with_close(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_once_listener_with_open(listener) {
        try {
            const ret = wasm.readstream_prepend_once_listener_with_open(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_once_listener_with_close(listener) {
        try {
            const ret = wasm.readstream_prepend_once_listener_with_close(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.ReadStream = ReadStream;

const ResolverFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_resolver_free(ptr >>> 0, 1));
/**
 *
 * Resolver is a client for obtaining public Kaspa wRPC URL.
 *
 * Resolver queries a list of public Kaspa Resolver URLs using HTTP to fetch
 * wRPC endpoints for the given encoding, network identifier and other
 * parameters. It then provides this information to the {@link RpcClient}.
 *
 * Each time {@link RpcClient} disconnects, it will query the resolver
 * to fetch a new wRPC URL.
 *
 * ```javascript
 * // using integrated public URLs
 * let rpc = RpcClient({
 *     resolver: new Resolver(),
 *     networkId : "mainnet"
 * });
 *
 * // specifying custom resolver URLs
 * let rpc = RpcClient({
 *     resolver: new Resolver({urls: ["<resolver-url>",...]}),
 *     networkId : "mainnet"
 * });
 * ```
 *
 * @see {@link IResolverConfig}, {@link IResolverConnect}, {@link RpcClient}
 * @category Node RPC
 */
class Resolver {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Resolver.prototype);
        obj.__wbg_ptr = ptr;
        ResolverFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            urls: this.urls,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ResolverFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_resolver_free(ptr, 0);
    }
    /**
     * List of public Kaspa Resolver URLs.
     * @returns {string[] | undefined}
     */
    get urls() {
        const ret = wasm.resolver_urls(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Fetches a public Kaspa wRPC endpoint for the given encoding and network identifier.
     * @see {@link Encoding}, {@link NetworkId}, {@link Node}
     * @param {Encoding} encoding
     * @param {NetworkId | string} network_id
     * @returns {Promise<NodeDescriptor>}
     */
    getNode(encoding, network_id) {
        const ret = wasm.resolver_getNode(this.__wbg_ptr, encoding, addHeapObject(network_id));
        return takeObject(ret);
    }
    /**
     * Fetches a public Kaspa wRPC endpoint URL for the given encoding and network identifier.
     * @see {@link Encoding}, {@link NetworkId}
     * @param {Encoding} encoding
     * @param {NetworkId | string} network_id
     * @returns {Promise<string>}
     */
    getUrl(encoding, network_id) {
        const ret = wasm.resolver_getUrl(this.__wbg_ptr, encoding, addHeapObject(network_id));
        return takeObject(ret);
    }
    /**
     * Connect to a public Kaspa wRPC endpoint for the given encoding and network identifier
     * supplied via {@link IResolverConnect} interface.
     * @see {@link IResolverConnect}, {@link RpcClient}
     * @param {IResolverConnect | NetworkId | string} options
     * @returns {Promise<RpcClient>}
     */
    connect(options) {
        const ret = wasm.resolver_connect(this.__wbg_ptr, addHeapObject(options));
        return takeObject(ret);
    }
    /**
     * Creates a new Resolver client with the given
     * configuration supplied as {@link IResolverConfig}
     * interface. If not supplied, the default configuration
     * containing a list of community-operated resolvers
     * will be used.
     * @param {IResolverConfig | string[] | null} [args]
     */
    constructor(args) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.resolver_ctor(retptr, isLikeNone(args) ? 0 : addHeapObject(args));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            ResolverFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.Resolver = Resolver;

const RpcClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rpcclient_free(ptr >>> 0, 1));
/**
 *
 *
 * Kaspa RPC client uses ([wRPC](https://github.com/workflow-rs/workflow-rs/tree/master/rpc))
 * interface to connect directly with Kaspa Node. wRPC supports
 * two types of encodings: `borsh` (binary, default) and `json`.
 *
 * There are two ways to connect: Directly to any Kaspa Node or to a
 * community-maintained public node infrastructure using the {@link Resolver} class.
 *
 * **Connecting to a public node using a resolver**
 *
 * ```javascript
 * let rpc = new RpcClient({
 *    resolver : new Resolver(),
 *    networkId : "mainnet",
 * });
 *
 * await rpc.connect();
 * ```
 *
 * **Connecting to a Kaspa Node directly**
 *
 * ```javascript
 * let rpc = new RpcClient({
 *    // if port is not provided it will default
 *    // to the default port for the networkId
 *    url : "127.0.0.1",
 *    networkId : "mainnet",
 * });
 * ```
 *
 * **Example usage**
 *
 * ```javascript
 *
 * // Create a new RPC client with a URL
 * let rpc = new RpcClient({ url : "wss://<node-wrpc-address>" });
 *
 * // Create a new RPC client with a resolver
 * // (networkId is required when using a resolver)
 * let rpc = new RpcClient({
 *     resolver : new Resolver(),
 *     networkId : "mainnet",
 * });
 *
 * rpc.addEventListener("connect", async (event) => {
 *     console.log("Connected to", rpc.url);
 *     await rpc.subscribeDaaScore();
 * });
 *
 * rpc.addEventListener("disconnect", (event) => {
 *     console.log("Disconnected from", rpc.url);
 * });
 *
 * try {
 *     await rpc.connect();
 * } catch(err) {
 *     console.log("Error connecting:", err);
 * }
 *
 * ```
 *
 * You can register event listeners to receive notifications from the RPC client
 * using {@link RpcClient.addEventListener} and {@link RpcClient.removeEventListener} functions.
 *
 * **IMPORTANT:** If RPC is disconnected, upon reconnection you do not need
 * to re-register event listeners, but your have to re-subscribe for Kaspa node
 * notifications:
 *
 * ```typescript
 * rpc.addEventListener("connect", async (event) => {
 *     console.log("Connected to", rpc.url);
 *     // re-subscribe each time we connect
 *     await rpc.subscribeDaaScore();
 *     // ... perform wallet address subscriptions
 * });
 *
 * ```
 *
 * If using NodeJS, it is important that {@link RpcClient.disconnect} is called before
 * the process exits to ensure that the WebSocket connection is properly closed.
 * Failure to do this will prevent the process from exiting.
 *
 * @category Node RPC
 */
class RpcClient {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RpcClient.prototype);
        obj.__wbg_ptr = ptr;
        RpcClientFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            url: this.url,
            resolver: this.resolver,
            isConnected: this.isConnected,
            encoding: this.encoding,
            nodeId: this.nodeId,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RpcClientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rpcclient_free(ptr, 0);
    }
    /**
     * Retrieves the current number of blocks in the Kaspa BlockDAG.
     * This is not a block count, not a "block height" and can not be
     * used for transaction validation.
     * Returned information: Current block count.
     * @see {@link IGetBlockCountRequest}, {@link IGetBlockCountResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetBlockCountRequest | null} [request]
     * @returns {Promise<IGetBlockCountResponse>}
     */
    getBlockCount(request) {
        const ret = wasm.rpcclient_getBlockCount(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Provides information about the Directed Acyclic Graph (DAG)
     * structure of the Kaspa BlockDAG.
     * Returned information: Number of blocks in the DAG,
     * number of tips in the DAG, hash of the selected parent block,
     * difficulty of the selected parent block, selected parent block
     * blue score, selected parent block time.
     * @see {@link IGetBlockDagInfoRequest}, {@link IGetBlockDagInfoResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetBlockDagInfoRequest | null} [request]
     * @returns {Promise<IGetBlockDagInfoResponse>}
     */
    getBlockDagInfo(request) {
        const ret = wasm.rpcclient_getBlockDagInfo(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Returns the total current coin supply of Kaspa network.
     * Returned information: Total coin supply.
     * @see {@link IGetCoinSupplyRequest}, {@link IGetCoinSupplyResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetCoinSupplyRequest | null} [request]
     * @returns {Promise<IGetCoinSupplyResponse>}
     */
    getCoinSupply(request) {
        const ret = wasm.rpcclient_getCoinSupply(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves information about the peers connected to the Kaspa node.
     * Returned information: Peer ID, IP address and port, connection
     * status, protocol version.
     * @see {@link IGetConnectedPeerInfoRequest}, {@link IGetConnectedPeerInfoResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetConnectedPeerInfoRequest | null} [request]
     * @returns {Promise<IGetConnectedPeerInfoResponse>}
     */
    getConnectedPeerInfo(request) {
        const ret = wasm.rpcclient_getConnectedPeerInfo(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves general information about the Kaspa node.
     * Returned information: Version of the Kaspa node, protocol
     * version, network identifier.
     * This call is primarily used by gRPC clients.
     * For wRPC clients, use {@link RpcClient.getServerInfo}.
     * @see {@link IGetInfoRequest}, {@link IGetInfoResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetInfoRequest | null} [request]
     * @returns {Promise<IGetInfoResponse>}
     */
    getInfo(request) {
        const ret = wasm.rpcclient_getInfo(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Provides a list of addresses of known peers in the Kaspa
     * network that the node can potentially connect to.
     * Returned information: List of peer addresses.
     * @see {@link IGetPeerAddressesRequest}, {@link IGetPeerAddressesResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetPeerAddressesRequest | null} [request]
     * @returns {Promise<IGetPeerAddressesResponse>}
     */
    getPeerAddresses(request) {
        const ret = wasm.rpcclient_getPeerAddresses(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves various metrics and statistics related to the
     * performance and status of the Kaspa node.
     * Returned information: Memory usage, CPU usage, network activity.
     * @see {@link IGetMetricsRequest}, {@link IGetMetricsResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetMetricsRequest | null} [request]
     * @returns {Promise<IGetMetricsResponse>}
     */
    getMetrics(request) {
        const ret = wasm.rpcclient_getMetrics(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves current number of network connections
     * @see {@link IGetConnectionsRequest}, {@link IGetConnectionsResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetConnectionsRequest | null} [request]
     * @returns {Promise<IGetConnectionsResponse>}
     */
    getConnections(request) {
        const ret = wasm.rpcclient_getConnections(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves the current sink block, which is the block with
     * the highest cumulative difficulty in the Kaspa BlockDAG.
     * Returned information: Sink block hash, sink block height.
     * @see {@link IGetSinkRequest}, {@link IGetSinkResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetSinkRequest | null} [request]
     * @returns {Promise<IGetSinkResponse>}
     */
    getSink(request) {
        const ret = wasm.rpcclient_getSink(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Returns the blue score of the current sink block, indicating
     * the total amount of work that has been done on the main chain
     * leading up to that block.
     * Returned information: Blue score of the sink block.
     * @see {@link IGetSinkBlueScoreRequest}, {@link IGetSinkBlueScoreResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetSinkBlueScoreRequest | null} [request]
     * @returns {Promise<IGetSinkBlueScoreResponse>}
     */
    getSinkBlueScore(request) {
        const ret = wasm.rpcclient_getSinkBlueScore(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Tests the connection and responsiveness of a Kaspa node.
     * Returned information: None.
     * @see {@link IPingRequest}, {@link IPingResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IPingRequest | null} [request]
     * @returns {Promise<IPingResponse>}
     */
    ping(request) {
        const ret = wasm.rpcclient_ping(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Gracefully shuts down the Kaspa node.
     * Returned information: None.
     * @see {@link IShutdownRequest}, {@link IShutdownResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IShutdownRequest | null} [request]
     * @returns {Promise<IShutdownResponse>}
     */
    shutdown(request) {
        const ret = wasm.rpcclient_shutdown(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves information about the Kaspa server.
     * Returned information: Version of the Kaspa server, protocol
     * version, network identifier.
     * @see {@link IGetServerInfoRequest}, {@link IGetServerInfoResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetServerInfoRequest | null} [request]
     * @returns {Promise<IGetServerInfoResponse>}
     */
    getServerInfo(request) {
        const ret = wasm.rpcclient_getServerInfo(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Obtains basic information about the synchronization status of the Kaspa node.
     * Returned information: Syncing status.
     * @see {@link IGetSyncStatusRequest}, {@link IGetSyncStatusResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetSyncStatusRequest | null} [request]
     * @returns {Promise<IGetSyncStatusResponse>}
     */
    getSyncStatus(request) {
        const ret = wasm.rpcclient_getSyncStatus(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Feerate estimates
     * @see {@link IGetFeeEstimateRequest}, {@link IGetFeeEstimateResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetFeeEstimateRequest | null} [request]
     * @returns {Promise<IGetFeeEstimateResponse>}
     */
    getFeeEstimate(request) {
        const ret = wasm.rpcclient_getFeeEstimate(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves the current network configuration.
     * Returned information: Current network configuration.
     * @see {@link IGetCurrentNetworkRequest}, {@link IGetCurrentNetworkResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetCurrentNetworkRequest | null} [request]
     * @returns {Promise<IGetCurrentNetworkResponse>}
     */
    getCurrentNetwork(request) {
        const ret = wasm.rpcclient_getCurrentNetwork(this.__wbg_ptr, isLikeNone(request) ? 0 : addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Adds a peer to the Kaspa node's list of known peers.
     * Returned information: None.
     * @see {@link IAddPeerRequest}, {@link IAddPeerResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IAddPeerRequest} request
     * @returns {Promise<IAddPeerResponse>}
     */
    addPeer(request) {
        const ret = wasm.rpcclient_addPeer(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Bans a peer from connecting to the Kaspa node for a specified duration.
     * Returned information: None.
     * @see {@link IBanRequest}, {@link IBanResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IBanRequest} request
     * @returns {Promise<IBanResponse>}
     */
    ban(request) {
        const ret = wasm.rpcclient_ban(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Estimates the network's current hash rate in hashes per second.
     * Returned information: Estimated network hashes per second.
     * @see {@link IEstimateNetworkHashesPerSecondRequest}, {@link IEstimateNetworkHashesPerSecondResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IEstimateNetworkHashesPerSecondRequest} request
     * @returns {Promise<IEstimateNetworkHashesPerSecondResponse>}
     */
    estimateNetworkHashesPerSecond(request) {
        const ret = wasm.rpcclient_estimateNetworkHashesPerSecond(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves the balance of a specific address in the Kaspa BlockDAG.
     * Returned information: Balance of the address.
     * @see {@link IGetBalanceByAddressRequest}, {@link IGetBalanceByAddressResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetBalanceByAddressRequest} request
     * @returns {Promise<IGetBalanceByAddressResponse>}
     */
    getBalanceByAddress(request) {
        const ret = wasm.rpcclient_getBalanceByAddress(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves balances for multiple addresses in the Kaspa BlockDAG.
     * Returned information: Balances of the addresses.
     * @see {@link IGetBalancesByAddressesRequest}, {@link IGetBalancesByAddressesResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetBalancesByAddressesRequest | Address[] | string[]} request
     * @returns {Promise<IGetBalancesByAddressesResponse>}
     */
    getBalancesByAddresses(request) {
        const ret = wasm.rpcclient_getBalancesByAddresses(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves a specific block from the Kaspa BlockDAG.
     * Returned information: Block information.
     * @see {@link IGetBlockRequest}, {@link IGetBlockResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetBlockRequest} request
     * @returns {Promise<IGetBlockResponse>}
     */
    getBlock(request) {
        const ret = wasm.rpcclient_getBlock(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves multiple blocks from the Kaspa BlockDAG.
     * Returned information: List of block information.
     * @see {@link IGetBlocksRequest}, {@link IGetBlocksResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetBlocksRequest} request
     * @returns {Promise<IGetBlocksResponse>}
     */
    getBlocks(request) {
        const ret = wasm.rpcclient_getBlocks(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Generates a new block template for mining.
     * Returned information: Block template information.
     * @see {@link IGetBlockTemplateRequest}, {@link IGetBlockTemplateResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetBlockTemplateRequest} request
     * @returns {Promise<IGetBlockTemplateResponse>}
     */
    getBlockTemplate(request) {
        const ret = wasm.rpcclient_getBlockTemplate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Checks if block is blue or not.
     * Returned information: Block blueness.
     * @see {@link IGetCurrentBlockColorRequest}, {@link IGetCurrentBlockColorResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetCurrentBlockColorRequest} request
     * @returns {Promise<IGetCurrentBlockColorResponse>}
     */
    getCurrentBlockColor(request) {
        const ret = wasm.rpcclient_getCurrentBlockColor(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves the estimated DAA (Difficulty Adjustment Algorithm)
     * score timestamp estimate.
     * Returned information: DAA score timestamp estimate.
     * @see {@link IGetDaaScoreTimestampEstimateRequest}, {@link IGetDaaScoreTimestampEstimateResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetDaaScoreTimestampEstimateRequest} request
     * @returns {Promise<IGetDaaScoreTimestampEstimateResponse>}
     */
    getDaaScoreTimestampEstimate(request) {
        const ret = wasm.rpcclient_getDaaScoreTimestampEstimate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Feerate estimates (experimental)
     * @see {@link IGetFeeEstimateExperimentalRequest}, {@link IGetFeeEstimateExperimentalResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetFeeEstimateExperimentalRequest} request
     * @returns {Promise<IGetFeeEstimateExperimentalResponse>}
     */
    getFeeEstimateExperimental(request) {
        const ret = wasm.rpcclient_getFeeEstimateExperimental(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves block headers from the Kaspa BlockDAG.
     * Returned information: List of block headers.
     * @see {@link IGetHeadersRequest}, {@link IGetHeadersResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetHeadersRequest} request
     * @returns {Promise<IGetHeadersResponse>}
     */
    getHeaders(request) {
        const ret = wasm.rpcclient_getHeaders(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves mempool entries from the Kaspa node's mempool.
     * Returned information: List of mempool entries.
     * @see {@link IGetMempoolEntriesRequest}, {@link IGetMempoolEntriesResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetMempoolEntriesRequest} request
     * @returns {Promise<IGetMempoolEntriesResponse>}
     */
    getMempoolEntries(request) {
        const ret = wasm.rpcclient_getMempoolEntries(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves mempool entries associated with specific addresses.
     * Returned information: List of mempool entries.
     * @see {@link IGetMempoolEntriesByAddressesRequest}, {@link IGetMempoolEntriesByAddressesResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetMempoolEntriesByAddressesRequest} request
     * @returns {Promise<IGetMempoolEntriesByAddressesResponse>}
     */
    getMempoolEntriesByAddresses(request) {
        const ret = wasm.rpcclient_getMempoolEntriesByAddresses(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves a specific mempool entry by transaction ID.
     * Returned information: Mempool entry information.
     * @see {@link IGetMempoolEntryRequest}, {@link IGetMempoolEntryResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetMempoolEntryRequest} request
     * @returns {Promise<IGetMempoolEntryResponse>}
     */
    getMempoolEntry(request) {
        const ret = wasm.rpcclient_getMempoolEntry(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves information about a subnetwork in the Kaspa BlockDAG.
     * Returned information: Subnetwork information.
     * @see {@link IGetSubnetworkRequest}, {@link IGetSubnetworkResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetSubnetworkRequest} request
     * @returns {Promise<IGetSubnetworkResponse>}
     */
    getSubnetwork(request) {
        const ret = wasm.rpcclient_getSubnetwork(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves unspent transaction outputs (UTXOs) associated with
     * specific addresses.
     * Returned information: List of UTXOs.
     * @see {@link IGetUtxosByAddressesRequest}, {@link IGetUtxosByAddressesResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetUtxosByAddressesRequest | Address[] | string[]} request
     * @returns {Promise<IGetUtxosByAddressesResponse>}
     */
    getUtxosByAddresses(request) {
        const ret = wasm.rpcclient_getUtxosByAddresses(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Retrieves the virtual chain corresponding to a specified block hash.
     * Returned information: Virtual chain information.
     * @see {@link IGetVirtualChainFromBlockRequest}, {@link IGetVirtualChainFromBlockResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetVirtualChainFromBlockRequest} request
     * @returns {Promise<IGetVirtualChainFromBlockResponse>}
     */
    getVirtualChainFromBlock(request) {
        const ret = wasm.rpcclient_getVirtualChainFromBlock(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Resolves a finality conflict in the Kaspa BlockDAG.
     * Returned information: None.
     * @see {@link IResolveFinalityConflictRequest}, {@link IResolveFinalityConflictResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IResolveFinalityConflictRequest} request
     * @returns {Promise<IResolveFinalityConflictResponse>}
     */
    resolveFinalityConflict(request) {
        const ret = wasm.rpcclient_resolveFinalityConflict(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Submits a block to the Kaspa network.
     * Returned information: None.
     * @see {@link ISubmitBlockRequest}, {@link ISubmitBlockResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {ISubmitBlockRequest} request
     * @returns {Promise<ISubmitBlockResponse>}
     */
    submitBlock(request) {
        const ret = wasm.rpcclient_submitBlock(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Submits a transaction to the Kaspa network.
     * Returned information: Submitted Transaction Id.
     * @see {@link ISubmitTransactionRequest}, {@link ISubmitTransactionResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {ISubmitTransactionRequest} request
     * @returns {Promise<ISubmitTransactionResponse>}
     */
    submitTransaction(request) {
        const ret = wasm.rpcclient_submitTransaction(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Submits an RBF transaction to the Kaspa network.
     * Returned information: Submitted Transaction Id, Transaction that was replaced.
     * @see {@link ISubmitTransactionReplacementRequest}, {@link ISubmitTransactionReplacementResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {ISubmitTransactionReplacementRequest} request
     * @returns {Promise<ISubmitTransactionReplacementResponse>}
     */
    submitTransactionReplacement(request) {
        const ret = wasm.rpcclient_submitTransactionReplacement(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Unbans a previously banned peer, allowing it to connect
     * to the Kaspa node again.
     * Returned information: None.
     * @see {@link IUnbanRequest}, {@link IUnbanResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IUnbanRequest} request
     * @returns {Promise<IUnbanResponse>}
     */
    unban(request) {
        const ret = wasm.rpcclient_unban(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * Manage subscription for a block added notification event.
     * Block added notification event is produced when a new
     * block is added to the Kaspa BlockDAG.
     * @returns {Promise<void>}
     */
    subscribeBlockAdded() {
        const ret = wasm.rpcclient_subscribeBlockAdded(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribeBlockAdded() {
        const ret = wasm.rpcclient_unsubscribeBlockAdded(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Manage subscription for a finality conflict notification event.
     * Finality conflict notification event is produced when a finality
     * conflict occurs in the Kaspa BlockDAG.
     * @returns {Promise<void>}
     */
    subscribeFinalityConflict() {
        const ret = wasm.rpcclient_subscribeFinalityConflict(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribeFinalityConflict() {
        const ret = wasm.rpcclient_unsubscribeFinalityConflict(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Manage subscription for a finality conflict resolved notification event.
     * Finality conflict resolved notification event is produced when a finality
     * conflict in the Kaspa BlockDAG is resolved.
     * @returns {Promise<void>}
     */
    subscribeFinalityConflictResolved() {
        const ret = wasm.rpcclient_subscribeFinalityConflictResolved(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribeFinalityConflictResolved() {
        const ret = wasm.rpcclient_unsubscribeFinalityConflictResolved(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Manage subscription for a sink blue score changed notification event.
     * Sink blue score changed notification event is produced when the blue
     * score of the sink block changes in the Kaspa BlockDAG.
     * @returns {Promise<void>}
     */
    subscribeSinkBlueScoreChanged() {
        const ret = wasm.rpcclient_subscribeSinkBlueScoreChanged(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribeSinkBlueScoreChanged() {
        const ret = wasm.rpcclient_unsubscribeSinkBlueScoreChanged(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Manage subscription for a pruning point UTXO set override notification event.
     * Pruning point UTXO set override notification event is produced when the
     * UTXO set override for the pruning point changes in the Kaspa BlockDAG.
     * @returns {Promise<void>}
     */
    subscribePruningPointUtxoSetOverride() {
        const ret = wasm.rpcclient_subscribePruningPointUtxoSetOverride(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribePruningPointUtxoSetOverride() {
        const ret = wasm.rpcclient_unsubscribePruningPointUtxoSetOverride(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Manage subscription for a new block template notification event.
     * New block template notification event is produced when a new block
     * template is generated for mining in the Kaspa BlockDAG.
     * @returns {Promise<void>}
     */
    subscribeNewBlockTemplate() {
        const ret = wasm.rpcclient_subscribeNewBlockTemplate(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribeNewBlockTemplate() {
        const ret = wasm.rpcclient_unsubscribeNewBlockTemplate(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Manage subscription for a virtual DAA score changed notification event.
     * Virtual DAA score changed notification event is produced when the virtual
     * Difficulty Adjustment Algorithm (DAA) score changes in the Kaspa BlockDAG.
     * @returns {Promise<void>}
     */
    subscribeVirtualDaaScoreChanged() {
        const ret = wasm.rpcclient_subscribeVirtualDaaScoreChanged(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Manage subscription for a virtual DAA score changed notification event.
     * Virtual DAA score changed notification event is produced when the virtual
     * Difficulty Adjustment Algorithm (DAA) score changes in the Kaspa BlockDAG.
     * @returns {Promise<void>}
     */
    unsubscribeVirtualDaaScoreChanged() {
        const ret = wasm.rpcclient_unsubscribeVirtualDaaScoreChanged(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Subscribe for a UTXOs changed notification event.
     * UTXOs changed notification event is produced when the set
     * of unspent transaction outputs (UTXOs) changes in the
     * Kaspa BlockDAG. The event notification will be scoped to the
     * provided list of addresses.
     * @param {(Address | string)[]} addresses
     * @returns {Promise<void>}
     */
    subscribeUtxosChanged(addresses) {
        const ret = wasm.rpcclient_subscribeUtxosChanged(this.__wbg_ptr, addHeapObject(addresses));
        return takeObject(ret);
    }
    /**
     * Unsubscribe from UTXOs changed notification event
     * for a specific set of addresses.
     * @param {(Address | string)[]} addresses
     * @returns {Promise<void>}
     */
    unsubscribeUtxosChanged(addresses) {
        const ret = wasm.rpcclient_unsubscribeUtxosChanged(this.__wbg_ptr, addHeapObject(addresses));
        return takeObject(ret);
    }
    /**
     * Manage subscription for a virtual chain changed notification event.
     * Virtual chain changed notification event is produced when the virtual
     * chain changes in the Kaspa BlockDAG.
     * @param {boolean} include_accepted_transaction_ids
     * @returns {Promise<void>}
     */
    subscribeVirtualChainChanged(include_accepted_transaction_ids) {
        const ret = wasm.rpcclient_subscribeVirtualChainChanged(this.__wbg_ptr, include_accepted_transaction_ids);
        return takeObject(ret);
    }
    /**
     * Manage subscription for a virtual chain changed notification event.
     * Virtual chain changed notification event is produced when the virtual
     * chain changes in the Kaspa BlockDAG.
     * @param {boolean} include_accepted_transaction_ids
     * @returns {Promise<void>}
     */
    unsubscribeVirtualChainChanged(include_accepted_transaction_ids) {
        const ret = wasm.rpcclient_unsubscribeVirtualChainChanged(this.__wbg_ptr, include_accepted_transaction_ids);
        return takeObject(ret);
    }
    /**
     * @param {Encoding} encoding
     * @param {NetworkType | NetworkId | string} network
     * @returns {number}
     */
    static defaultPort(encoding, network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rpcclient_defaultPort(retptr, encoding, addBorrowedObject(network));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return r0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Constructs an WebSocket RPC URL given the partial URL or an IP, RPC encoding
     * and a network type.
     *
     * # Arguments
     *
     * * `url` - Partial URL or an IP address
     * * `encoding` - RPC encoding
     * * `network_type` - Network type
     * @param {string} url
     * @param {Encoding} encoding
     * @param {NetworkId} network
     * @returns {string}
     */
    static parseUrl(url, encoding, network) {
        let deferred4_0;
        let deferred4_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(url, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(network, NetworkId);
            var ptr1 = network.__destroy_into_raw();
            wasm.rpcclient_parseUrl(retptr, ptr0, len0, encoding, ptr1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr3 = r0;
            var len3 = r1;
            if (r3) {
                ptr3 = 0; len3 = 0;
                throw takeObject(r2);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred4_0, deferred4_1, 1);
        }
    }
    /**
     *
     * Create a new RPC client with optional {@link Encoding} and a `url`.
     *
     * @see {@link IRpcConfig} interface for more details.
     * @param {IRpcConfig | null} [config]
     */
    constructor(config) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rpcclient_ctor(retptr, isLikeNone(config) ? 0 : addHeapObject(config));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            RpcClientFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * The current URL of the RPC client.
     * @returns {string | undefined}
     */
    get url() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rpcclient_url(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Current rpc resolver
     * @returns {Resolver | undefined}
     */
    get resolver() {
        const ret = wasm.rpcclient_resolver(this.__wbg_ptr);
        return ret === 0 ? undefined : Resolver.__wrap(ret);
    }
    /**
     * Set the resolver for the RPC client.
     * This setting will take effect on the next connection.
     * @param {Resolver} resolver
     */
    setResolver(resolver) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(resolver, Resolver);
            var ptr0 = resolver.__destroy_into_raw();
            wasm.rpcclient_setResolver(retptr, this.__wbg_ptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Set the network id for the RPC client.
     * This setting will take effect on the next connection.
     * @param {NetworkId | string} network_id
     */
    setNetworkId(network_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rpcclient_setNetworkId(retptr, this.__wbg_ptr, addBorrowedObject(network_id));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * The current connection status of the RPC client.
     * @returns {boolean}
     */
    get isConnected() {
        const ret = wasm.rpcclient_isConnected(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * The current protocol encoding.
     * @returns {string}
     */
    get encoding() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rpcclient_encoding(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Optional: Resolver node id.
     * @returns {string | undefined}
     */
    get nodeId() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rpcclient_nodeId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Connect to the Kaspa RPC server. This function starts a background
     * task that connects and reconnects to the server if the connection
     * is terminated.  Use [`disconnect()`](Self::disconnect()) to
     * terminate the connection.
     * @see {@link IConnectOptions} interface for more details.
     * @param {IConnectOptions | undefined | null} [args]
     * @returns {Promise<void>}
     */
    connect(args) {
        const ret = wasm.rpcclient_connect(this.__wbg_ptr, isLikeNone(args) ? 0 : addHeapObject(args));
        return takeObject(ret);
    }
    /**
     * Disconnect from the Kaspa RPC server.
     * @returns {Promise<void>}
     */
    disconnect() {
        const ret = wasm.rpcclient_disconnect(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Start background RPC services (automatically started when invoking {@link RpcClient.connect}).
     * @returns {Promise<void>}
     */
    start() {
        const ret = wasm.rpcclient_start(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Stop background RPC services (automatically stopped when invoking {@link RpcClient.disconnect}).
     * @returns {Promise<void>}
     */
    stop() {
        const ret = wasm.rpcclient_stop(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Triggers a disconnection on the underlying WebSocket
     * if the WebSocket is in connected state.
     * This is intended for debug purposes only.
     * Can be used to test application reconnection logic.
     */
    triggerAbort() {
        wasm.rpcclient_triggerAbort(this.__wbg_ptr);
    }
    /**
     *
     * Register an event listener callback.
     *
     * Registers a callback function to be executed when a specific event occurs.
     * The callback function will receive an {@link RpcEvent} object with the event `type` and `data`.
     *
     * **RPC Subscriptions vs Event Listeners**
     *
     * Subscriptions are used to receive notifications from the RPC client.
     * Event listeners are client-side application registrations that are
     * triggered when notifications are received.
     *
     * If node is disconnected, upon reconnection you do not need to re-register event listeners,
     * however, you have to re-subscribe for Kaspa node notifications. As such, it is recommended
     * to register event listeners when the RPC `open` event is received.
     *
     * ```javascript
     * rpc.addEventListener("connect", async (event) => {
     *     console.log("Connected to", rpc.url);
     *     await rpc.subscribeDaaScore();
     *     // ... perform wallet address subscriptions
     * });
     * ```
     *
     * **Multiple events and listeners**
     *
     * `addEventListener` can be used to register multiple event listeners for the same event
     * as well as the same event listener for multiple events.
     *
     * ```javascript
     * // Registering a single event listener for multiple events:
     * rpc.addEventListener(["connect", "disconnect"], (event) => {
     *     console.log(event);
     * });
     *
     * // Registering event listener for all events:
     * // (by omitting the event type)
     * rpc.addEventListener((event) => {
     *     console.log(event);
     * });
     *
     * // Registering multiple event listeners for the same event:
     * rpc.addEventListener("connect", (event) => { // first listener
     *     console.log(event);
     * });
     * rpc.addEventListener("connect", (event) => { // second listener
     *     console.log(event);
     * });
     * ```
     *
     * **Use of context objects**
     *
     * You can also register an event with a `context` object. When the event is triggered,
     * the `handleEvent` method of the `context` object will be called while `this` value
     * will be set to the `context` object.
     * ```javascript
     * // Registering events with a context object:
     *
     * const context = {
     *     someProperty: "someValue",
     *     handleEvent: (event) => {
     *         // the following will log "someValue"
     *         console.log(this.someProperty);
     *         console.log(event);
     *     }
     * };
     * rpc.addEventListener(["connect","disconnect"], context);
     *
     * ```
     *
     * **General use examples**
     *
     * In TypeScript you can use {@link RpcEventType} enum (such as `RpcEventType.Connect`)
     * or `string` (such as "connect") to register event listeners.
     * In JavaScript you can only use `string`.
     *
     * ```typescript
     * // Example usage (TypeScript):
     *
     * rpc.addEventListener(RpcEventType.Connect, (event) => {
     *     console.log("Connected to", rpc.url);
     * });
     *
     * rpc.addEventListener(RpcEventType.VirtualDaaScoreChanged, (event) => {
     *     console.log(event.type,event.data);
     * });
     * await rpc.subscribeDaaScore();
     *
     * rpc.addEventListener(RpcEventType.BlockAdded, (event) => {
     *     console.log(event.type,event.data);
     * });
     * await rpc.subscribeBlockAdded();
     *
     * // Example usage (JavaScript):
     *
     * rpc.addEventListener("virtual-daa-score-changed", (event) => {
     *     console.log(event.type,event.data);
     * });
     *
     * await rpc.subscribeDaaScore();
     * rpc.addEventListener("block-added", (event) => {
     *     console.log(event.type,event.data);
     * });
     * await rpc.subscribeBlockAdded();
     * ```
     *
     * @see {@link RpcEventType} for a list of supported events.
     * @see {@link RpcEventData} for the event data interface specification.
     * @see {@link RpcClient.removeEventListener}, {@link RpcClient.removeAllEventListeners}
     * @param {RpcEventType | string | RpcEventCallback} event
     * @param {RpcEventCallback | null} [callback]
     */
    addEventListener(event, callback) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rpcclient_addEventListener(retptr, this.__wbg_ptr, addHeapObject(event), isLikeNone(callback) ? 0 : addHeapObject(callback));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     *
     * Unregister an event listener.
     * This function will remove the callback for the specified event.
     * If the `callback` is not supplied, all callbacks will be
     * removed for the specified event.
     *
     * @see {@link RpcClient.addEventListener}
     * @param {RpcEventType | string} event
     * @param {RpcEventCallback | null} [callback]
     */
    removeEventListener(event, callback) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rpcclient_removeEventListener(retptr, this.__wbg_ptr, addHeapObject(event), isLikeNone(callback) ? 0 : addHeapObject(callback));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     *
     * Unregister a single event listener callback from all events.
     *
     *
     * @param {RpcEventCallback} callback
     */
    clearEventListener(callback) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rpcclient_clearEventListener(retptr, this.__wbg_ptr, addHeapObject(callback));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     *
     * Unregister all notification callbacks for all events.
     */
    removeAllEventListeners() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rpcclient_removeAllEventListeners(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.RpcClient = RpcClient;

const ScriptBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scriptbuilder_free(ptr >>> 0, 1));
/**
 * ScriptBuilder provides a facility for building custom scripts. It allows
 * you to push opcodes, ints, and data while respecting canonical encoding. In
 * general it does not ensure the script will execute correctly, however any
 * data pushes which would exceed the maximum allowed script engine limits and
 * are therefore guaranteed not to execute will not be pushed and will result in
 * the Script function returning an error.
 * @category Consensus
 */
class ScriptBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ScriptBuilder.prototype);
        obj.__wbg_ptr = ptr;
        ScriptBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ScriptBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scriptbuilder_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.scriptbuilder_new();
        this.__wbg_ptr = ret >>> 0;
        ScriptBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Creates a new ScriptBuilder over an existing script.
     * Supplied script can be represented as an `Uint8Array` or a `HexString`.
     * @param {HexString | Uint8Array} script
     * @returns {ScriptBuilder}
     */
    static fromScript(script) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuilder_fromScript(retptr, addHeapObject(script));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ScriptBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Pushes the passed opcode to the end of the script. The script will not
     * be modified if pushing the opcode would cause the script to exceed the
     * maximum allowed script engine size.
     * @param {number} op
     * @returns {ScriptBuilder}
     */
    addOp(op) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuilder_addOp(retptr, this.__wbg_ptr, op);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ScriptBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Adds the passed opcodes to the end of the script.
     * Supplied opcodes can be represented as an `Uint8Array` or a `HexString`.
     * @param {HexString | Uint8Array} opcodes
     * @returns {ScriptBuilder}
     */
    addOps(opcodes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuilder_addOps(retptr, this.__wbg_ptr, addHeapObject(opcodes));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ScriptBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * AddData pushes the passed data to the end of the script. It automatically
     * chooses canonical opcodes depending on the length of the data.
     *
     * A zero length buffer will lead to a push of empty data onto the stack (Op0 = OpFalse)
     * and any push of data greater than [`MAX_SCRIPT_ELEMENT_SIZE`](kaspa_txscript::MAX_SCRIPT_ELEMENT_SIZE) will not modify
     * the script since that is not allowed by the script engine.
     *
     * Also, the script will not be modified if pushing the data would cause the script to
     * exceed the maximum allowed script engine size [`MAX_SCRIPTS_SIZE`](kaspa_txscript::MAX_SCRIPTS_SIZE).
     * @param {HexString | Uint8Array} data
     * @returns {ScriptBuilder}
     */
    addData(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuilder_addData(retptr, this.__wbg_ptr, addHeapObject(data));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ScriptBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} value
     * @returns {ScriptBuilder}
     */
    addI64(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuilder_addI64(retptr, this.__wbg_ptr, value);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ScriptBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} lock_time
     * @returns {ScriptBuilder}
     */
    addLockTime(lock_time) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuilder_addLockTime(retptr, this.__wbg_ptr, lock_time);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ScriptBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} sequence
     * @returns {ScriptBuilder}
     */
    addSequence(sequence) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuilder_addLockTime(retptr, this.__wbg_ptr, sequence);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ScriptBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {HexString | Uint8Array} data
     * @returns {number}
     */
    static canonicalDataSize(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuilder_canonicalDataSize(retptr, addHeapObject(data));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get script bytes represented by a hex string.
     * @returns {HexString}
     */
    toString() {
        const ret = wasm.scriptbuilder_toString(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Drains (empties) the script builder, returning the
     * script bytes represented by a hex string.
     * @returns {HexString}
     */
    drain() {
        const ret = wasm.scriptbuilder_drain(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Creates an equivalent pay-to-script-hash script.
     * Can be used to create an P2SH address.
     * @see {@link addressFromScriptPublicKey}
     * @returns {ScriptPublicKey}
     */
    createPayToScriptHashScript() {
        const ret = wasm.scriptbuilder_createPayToScriptHashScript(this.__wbg_ptr);
        return ScriptPublicKey.__wrap(ret);
    }
    /**
     * Generates a signature script that fits a pay-to-script-hash script.
     * @param {HexString | Uint8Array} signature
     * @returns {HexString}
     */
    encodePayToScriptHashSignatureScript(signature) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuilder_encodePayToScriptHashSignatureScript(retptr, this.__wbg_ptr, addHeapObject(signature));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {IHexViewConfig | null} [args]
     * @returns {string}
     */
    hexView(args) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuilder_hexView(retptr, this.__wbg_ptr, isLikeNone(args) ? 0 : addHeapObject(args));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
}
module.exports.ScriptBuilder = ScriptBuilder;

const ScriptPublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scriptpublickey_free(ptr >>> 0, 1));
/**
 * Represents a Kaspad ScriptPublicKey
 * @category Consensus
 */
class ScriptPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ScriptPublicKey.prototype);
        obj.__wbg_ptr = ptr;
        ScriptPublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            version: this.version,
            script: this.script,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ScriptPublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scriptpublickey_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get version() {
        const ret = wasm.__wbg_get_scriptpublickey_version(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set version(arg0) {
        wasm.__wbg_set_scriptpublickey_version(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} version
     * @param {any} script
     */
    constructor(version, script) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptpublickey_constructor(retptr, version, addHeapObject(script));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            ScriptPublicKeyFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    get script() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptpublickey_script_as_hex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.ScriptPublicKey = ScriptPublicKey;

const SetAadOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_setaadoptions_free(ptr >>> 0, 1));

class SetAadOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SetAadOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_setaadoptions_free(ptr, 0);
    }
    /**
     * @param {Function} flush
     * @param {number} plaintext_length
     * @param {Function} transform
     */
    constructor(flush, plaintext_length, transform) {
        const ret = wasm.setaadoptions_new(addHeapObject(flush), plaintext_length, addHeapObject(transform));
        this.__wbg_ptr = ret >>> 0;
        SetAadOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Function}
     */
    get flush() {
        const ret = wasm.setaadoptions_flush(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Function} value
     */
    set flush(value) {
        wasm.setaadoptions_set_flush(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {number}
     */
    get plaintextLength() {
        const ret = wasm.setaadoptions_plaintextLength(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set plaintext_length(value) {
        wasm.setaadoptions_set_plaintext_length(this.__wbg_ptr, value);
    }
    /**
     * @returns {Function}
     */
    get transform() {
        const ret = wasm.setaadoptions_transform(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Function} value
     */
    set transform(value) {
        wasm.setaadoptions_set_transform(this.__wbg_ptr, addHeapObject(value));
    }
}
module.exports.SetAadOptions = SetAadOptions;

const SigHashTypeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sighashtype_free(ptr >>> 0, 1));

class SigHashType {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SigHashTypeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sighashtype_free(ptr, 0);
    }
}
module.exports.SigHashType = SigHashType;

const StorageFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_storage_free(ptr >>> 0, 1));
/**
 * Wallet file storage interface
 * @category Wallet SDK
 */
class Storage {

    toJSON() {
        return {
            filename: this.filename,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StorageFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_storage_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get filename() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.storage_filename(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.Storage = Storage;

const StreamTransformOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_streamtransformoptions_free(ptr >>> 0, 1));

class StreamTransformOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StreamTransformOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_streamtransformoptions_free(ptr, 0);
    }
    /**
     * @param {Function} flush
     * @param {Function} transform
     */
    constructor(flush, transform) {
        const ret = wasm.streamtransformoptions_new(addHeapObject(flush), addHeapObject(transform));
        this.__wbg_ptr = ret >>> 0;
        StreamTransformOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Function}
     */
    get flush() {
        const ret = wasm.streamtransformoptions_flush(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Function} value
     */
    set flush(value) {
        wasm.streamtransformoptions_set_flush(this.__wbg_ptr, addHeapObject(value));
    }
    /**
     * @returns {Function}
     */
    get transform() {
        const ret = wasm.streamtransformoptions_transform(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {Function} value
     */
    set transform(value) {
        wasm.streamtransformoptions_set_transform(this.__wbg_ptr, addHeapObject(value));
    }
}
module.exports.StreamTransformOptions = StreamTransformOptions;

const TransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transaction_free(ptr >>> 0, 1));
/**
 * Represents a Kaspa transaction.
 * This is an artificial construct that includes additional
 * transaction-related data such as additional data from UTXOs
 * used by transaction inputs.
 * @category Consensus
 */
class Transaction {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Transaction.prototype);
        obj.__wbg_ptr = ptr;
        TransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            id: this.id,
            inputs: this.inputs,
            outputs: this.outputs,
            version: this.version,
            lockTime: this.lockTime,
            gas: this.gas,
            subnetworkId: this.subnetworkId,
            payload: this.payload,
            mass: this.mass,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transaction_free(ptr, 0);
    }
    /**
     * Determines whether or not a transaction is a coinbase transaction. A coinbase
     * transaction is a special transaction created by miners that distributes fees and block subsidy
     * to the previous blocks' miners, and specifies the script_pub_key that will be used to pay the current
     * miner in future blocks.
     * @returns {boolean}
     */
    is_coinbase() {
        const ret = wasm.transaction_is_coinbase(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Recompute and finalize the tx id based on updated tx fields
     * @returns {Hash}
     */
    finalize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_finalize(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Hash.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Returns the transaction ID
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {ITransaction | Transaction} js_value
     */
    constructor(js_value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_constructor(retptr, addBorrowedObject(js_value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            TransactionFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {TransactionInput[]}
     */
    get inputs() {
        const ret = wasm.transaction_get_inputs_as_js_array(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Returns a list of unique addresses used by transaction inputs.
     * This method can be used to determine addresses used by transaction inputs
     * in order to select private keys needed for transaction signing.
     * @param {NetworkType | NetworkId | string} network_type
     * @returns {Address[]}
     */
    addresses(network_type) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_addresses(retptr, this.__wbg_ptr, addBorrowedObject(network_type));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {(ITransactionInput | TransactionInput)[]} js_value
     */
    set inputs(js_value) {
        try {
            wasm.transaction_set_inputs_from_js_array(this.__wbg_ptr, addBorrowedObject(js_value));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {TransactionOutput[]}
     */
    get outputs() {
        const ret = wasm.transaction_get_outputs_as_js_array(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {(ITransactionOutput | TransactionOutput)[]} js_value
     */
    set outputs(js_value) {
        try {
            wasm.transaction_set_outputs_from_js_array(this.__wbg_ptr, addBorrowedObject(js_value));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {number}
     */
    get version() {
        const ret = wasm.transaction_version(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} v
     */
    set version(v) {
        wasm.transaction_set_version(this.__wbg_ptr, v);
    }
    /**
     * @returns {bigint}
     */
    get lockTime() {
        const ret = wasm.transaction_lockTime(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} v
     */
    set lockTime(v) {
        wasm.transaction_set_lockTime(this.__wbg_ptr, v);
    }
    /**
     * @returns {bigint}
     */
    get gas() {
        const ret = wasm.transaction_gas(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} v
     */
    set gas(v) {
        wasm.transaction_set_gas(this.__wbg_ptr, v);
    }
    /**
     * @returns {string}
     */
    get subnetworkId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_get_subnetwork_id_as_hex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} js_value
     */
    set subnetworkId(js_value) {
        wasm.transaction_set_subnetwork_id_from_js_value(this.__wbg_ptr, addHeapObject(js_value));
    }
    /**
     * @returns {string}
     */
    get payload() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_get_payload_as_hex_string(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} js_value
     */
    set payload(js_value) {
        wasm.transaction_set_payload_from_js_value(this.__wbg_ptr, addHeapObject(js_value));
    }
    /**
     * @returns {bigint}
     */
    get mass() {
        const ret = wasm.transaction_get_mass(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} v
     */
    set mass(v) {
        wasm.transaction_set_mass(this.__wbg_ptr, v);
    }
    /**
     * Serializes the transaction to a pure JavaScript Object.
     * The schema of the JavaScript object is defined by {@link ISerializableTransaction}.
     * @see {@link ISerializableTransaction}
     * @returns {ISerializableTransaction}
     */
    serializeToObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_serializeToObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Serializes the transaction to a JSON string.
     * The schema of the JSON is defined by {@link ISerializableTransaction}.
     * @returns {string}
     */
    serializeToJSON() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_serializeToJSON(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Serializes the transaction to a "Safe" JSON schema where it converts all `bigint` values to `string` to avoid potential client-side precision loss.
     * @returns {string}
     */
    serializeToSafeJSON() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_serializeToSafeJSON(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Deserialize the {@link Transaction} Object from a pure JavaScript Object.
     * @param {any} js_value
     * @returns {Transaction}
     */
    static deserializeFromObject(js_value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_deserializeFromObject(retptr, addBorrowedObject(js_value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Transaction.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Deserialize the {@link Transaction} Object from a JSON string.
     * @param {string} json
     * @returns {Transaction}
     */
    static deserializeFromJSON(json) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.transaction_deserializeFromJSON(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Transaction.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Deserialize the {@link Transaction} Object from a "Safe" JSON schema where all `bigint` values are represented as `string`.
     * @param {string} json
     * @returns {Transaction}
     */
    static deserializeFromSafeJSON(json) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.transaction_deserializeFromSafeJSON(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Transaction.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.Transaction = Transaction;

const TransactionInputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactioninput_free(ptr >>> 0, 1));
/**
 * Represents a Kaspa transaction input
 * @category Consensus
 */
class TransactionInput {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionInput.prototype);
        obj.__wbg_ptr = ptr;
        TransactionInputFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            previousOutpoint: this.previousOutpoint,
            signatureScript: this.signatureScript,
            sequence: this.sequence,
            sigOpCount: this.sigOpCount,
            utxo: this.utxo,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionInputFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactioninput_free(ptr, 0);
    }
    /**
     * @param {ITransactionInput | TransactionInput} value
     */
    constructor(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactioninput_constructor(retptr, addBorrowedObject(value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            TransactionInputFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {TransactionOutpoint}
     */
    get previousOutpoint() {
        const ret = wasm.transactioninput_get_previous_outpoint(this.__wbg_ptr);
        return TransactionOutpoint.__wrap(ret);
    }
    /**
     * @param {any} js_value
     */
    set previousOutpoint(js_value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactioninput_set_previous_outpoint(retptr, this.__wbg_ptr, addBorrowedObject(js_value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {string | undefined}
     */
    get signatureScript() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactioninput_get_signature_script_as_hex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} js_value
     */
    set signatureScript(js_value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactioninput_set_signature_script_from_js_value(retptr, this.__wbg_ptr, addHeapObject(js_value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {bigint}
     */
    get sequence() {
        const ret = wasm.transactioninput_get_sequence(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} sequence
     */
    set sequence(sequence) {
        wasm.transactioninput_set_sequence(this.__wbg_ptr, sequence);
    }
    /**
     * @returns {number}
     */
    get sigOpCount() {
        const ret = wasm.transactioninput_get_sig_op_count(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} sig_op_count
     */
    set sigOpCount(sig_op_count) {
        wasm.transactioninput_set_sig_op_count(this.__wbg_ptr, sig_op_count);
    }
    /**
     * @returns {UtxoEntryReference | undefined}
     */
    get utxo() {
        const ret = wasm.transactioninput_get_utxo(this.__wbg_ptr);
        return ret === 0 ? undefined : UtxoEntryReference.__wrap(ret);
    }
}
module.exports.TransactionInput = TransactionInput;

const TransactionOutpointFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionoutpoint_free(ptr >>> 0, 1));
/**
 * Represents a Kaspa transaction outpoint.
 * NOTE: This struct is immutable - to create a custom outpoint
 * use the `TransactionOutpoint::new` constructor. (in JavaScript
 * use `new TransactionOutpoint(transactionId, index)`).
 * @category Consensus
 */
class TransactionOutpoint {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionOutpoint.prototype);
        obj.__wbg_ptr = ptr;
        TransactionOutpointFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            transactionId: this.transactionId,
            index: this.index,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionOutpointFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionoutpoint_free(ptr, 0);
    }
    /**
     * @param {Hash} transaction_id
     * @param {number} index
     */
    constructor(transaction_id, index) {
        _assertClass(transaction_id, Hash);
        var ptr0 = transaction_id.__destroy_into_raw();
        const ret = wasm.transactionoutpoint_ctor(ptr0, index);
        this.__wbg_ptr = ret >>> 0;
        TransactionOutpointFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    getId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactionoutpoint_getId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get transactionId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactionoutpoint_transactionId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get index() {
        const ret = wasm.transactionoutpoint_index(this.__wbg_ptr);
        return ret >>> 0;
    }
}
module.exports.TransactionOutpoint = TransactionOutpoint;

const TransactionOutputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionoutput_free(ptr >>> 0, 1));
/**
 * Represents a Kaspad transaction output
 * @category Consensus
 */
class TransactionOutput {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionOutput.prototype);
        obj.__wbg_ptr = ptr;
        TransactionOutputFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            value: this.value,
            scriptPublicKey: this.scriptPublicKey,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionOutputFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionoutput_free(ptr, 0);
    }
    /**
     * TransactionOutput constructor
     * @param {bigint} value
     * @param {ScriptPublicKey} script_public_key
     */
    constructor(value, script_public_key) {
        _assertClass(script_public_key, ScriptPublicKey);
        const ret = wasm.transactionoutput_ctor(value, script_public_key.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        TransactionOutputFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {bigint}
     */
    get value() {
        const ret = wasm.transactionoutput_value(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} v
     */
    set value(v) {
        wasm.transactionoutput_set_value(this.__wbg_ptr, v);
    }
    /**
     * @returns {ScriptPublicKey}
     */
    get scriptPublicKey() {
        const ret = wasm.transactionoutput_scriptPublicKey(this.__wbg_ptr);
        return ScriptPublicKey.__wrap(ret);
    }
    /**
     * @param {ScriptPublicKey} v
     */
    set scriptPublicKey(v) {
        _assertClass(v, ScriptPublicKey);
        wasm.transactionoutput_set_scriptPublicKey(this.__wbg_ptr, v.__wbg_ptr);
    }
}
module.exports.TransactionOutput = TransactionOutput;

const TransactionRecordFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionrecord_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
class TransactionRecord {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionRecord.prototype);
        obj.__wbg_ptr = ptr;
        TransactionRecordFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            id: this.id,
            unixtimeMsec: this.unixtimeMsec,
            network: this.network,
            note: this.note,
            metadata: this.metadata,
            value: this.value,
            blockDaaScore: this.blockDaaScore,
            binding: this.binding,
            data: this.data,
            type: this.type,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionRecordFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionrecord_free(ptr, 0);
    }
    /**
     * @returns {Hash}
     */
    get id() {
        const ret = wasm.__wbg_get_transactionrecord_id(this.__wbg_ptr);
        return Hash.__wrap(ret);
    }
    /**
     * @param {Hash} arg0
     */
    set id(arg0) {
        _assertClass(arg0, Hash);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_transactionrecord_id(this.__wbg_ptr, ptr0);
    }
    /**
     * Unix time in milliseconds
     * @returns {bigint | undefined}
     */
    get unixtimeMsec() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactionrecord_unixtimeMsec(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Unix time in milliseconds
     * @param {bigint | null} [arg0]
     */
    set unixtimeMsec(arg0) {
        wasm.__wbg_set_transactionrecord_unixtimeMsec(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @returns {NetworkId}
     */
    get network() {
        const ret = wasm.__wbg_get_transactionrecord_network(this.__wbg_ptr);
        return NetworkId.__wrap(ret);
    }
    /**
     * @param {NetworkId} arg0
     */
    set network(arg0) {
        _assertClass(arg0, NetworkId);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_transactionrecord_network(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {string | undefined}
     */
    get note() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactionrecord_note(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string | null} [arg0]
     */
    set note(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_transactionrecord_note(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get metadata() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactionrecord_metadata(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string | null} [arg0]
     */
    set metadata(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_transactionrecord_metadata(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} currentDaaScore
     * @returns {string}
     */
    maturityProgress(currentDaaScore) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactionrecord_maturityProgress(retptr, this.__wbg_ptr, addHeapObject(currentDaaScore));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get value() {
        const ret = wasm.transactionrecord_value(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {bigint}
     */
    get blockDaaScore() {
        const ret = wasm.transactionrecord_blockDaaScore(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {IBinding}
     */
    get binding() {
        const ret = wasm.transactionrecord_binding(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {ITransactionData}
     */
    get data() {
        const ret = wasm.transactionrecord_data(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactionrecord_type(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Check if the transaction record has the given address within the associated UTXO set.
     * @param {Address} address
     * @returns {boolean}
     */
    hasAddress(address) {
        _assertClass(address, Address);
        const ret = wasm.transactionrecord_hasAddress(this.__wbg_ptr, address.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Serialize the transaction record to a JavaScript object.
     * @returns {any}
     */
    serialize() {
        const ret = wasm.transactionrecord_serialize(this.__wbg_ptr);
        return takeObject(ret);
    }
}
module.exports.TransactionRecord = TransactionRecord;

const TransactionRecordNotificationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionrecordnotification_free(ptr >>> 0, 1));

class TransactionRecordNotification {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionRecordNotification.prototype);
        obj.__wbg_ptr = ptr;
        TransactionRecordNotificationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            type: this.type,
            data: this.data,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionRecordNotificationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionrecordnotification_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_transactionrecordnotification_type(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set type(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_transactionrecordnotification_type(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {TransactionRecord}
     */
    get data() {
        const ret = wasm.__wbg_get_transactionrecordnotification_data(this.__wbg_ptr);
        return TransactionRecord.__wrap(ret);
    }
    /**
     * @param {TransactionRecord} arg0
     */
    set data(arg0) {
        _assertClass(arg0, TransactionRecord);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_transactionrecordnotification_data(this.__wbg_ptr, ptr0);
    }
}
module.exports.TransactionRecordNotification = TransactionRecordNotification;

const TransactionSigningHashFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionsigninghash_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
class TransactionSigningHash {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionSigningHashFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionsigninghash_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.transactionsigninghash_new();
        this.__wbg_ptr = ret >>> 0;
        TransactionSigningHashFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {HexString | Uint8Array} data
     */
    update(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactionsigninghash_update(retptr, this.__wbg_ptr, addHeapObject(data));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    finalize() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactionsigninghash_finalize(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.TransactionSigningHash = TransactionSigningHash;

const TransactionSigningHashECDSAFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionsigninghashecdsa_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
class TransactionSigningHashECDSA {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionSigningHashECDSAFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionsigninghashecdsa_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.transactionsigninghashecdsa_new();
        this.__wbg_ptr = ret >>> 0;
        TransactionSigningHashECDSAFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {HexString | Uint8Array} data
     */
    update(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactionsigninghashecdsa_update(retptr, this.__wbg_ptr, addHeapObject(data));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    finalize() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transactionsigninghashecdsa_finalize(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.TransactionSigningHashECDSA = TransactionSigningHashECDSA;

const TransactionUtxoEntryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionutxoentry_free(ptr >>> 0, 1));
/**
 * Holds details about an individual transaction output in a utxo
 * set such as whether or not it was contained in a coinbase tx, the daa
 * score of the block that accepts the tx, its public key script, and how
 * much it pays.
 * @category Consensus
 */
class TransactionUtxoEntry {

    toJSON() {
        return {
            amount: this.amount,
            scriptPublicKey: this.scriptPublicKey,
            blockDaaScore: this.blockDaaScore,
            isCoinbase: this.isCoinbase,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionUtxoEntryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionutxoentry_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.__wbg_get_transactionutxoentry_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set amount(arg0) {
        wasm.__wbg_set_transactionutxoentry_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {ScriptPublicKey}
     */
    get scriptPublicKey() {
        const ret = wasm.__wbg_get_transactionutxoentry_scriptPublicKey(this.__wbg_ptr);
        return ScriptPublicKey.__wrap(ret);
    }
    /**
     * @param {ScriptPublicKey} arg0
     */
    set scriptPublicKey(arg0) {
        _assertClass(arg0, ScriptPublicKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_transactionutxoentry_scriptPublicKey(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {bigint}
     */
    get blockDaaScore() {
        const ret = wasm.__wbg_get_transactionutxoentry_blockDaaScore(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set blockDaaScore(arg0) {
        wasm.__wbg_set_transactionutxoentry_blockDaaScore(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {boolean}
     */
    get isCoinbase() {
        const ret = wasm.__wbg_get_transactionutxoentry_isCoinbase(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set isCoinbase(arg0) {
        wasm.__wbg_set_transactionutxoentry_isCoinbase(this.__wbg_ptr, arg0);
    }
}
module.exports.TransactionUtxoEntry = TransactionUtxoEntry;

const UserInfoOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_userinfooptions_free(ptr >>> 0, 1));

class UserInfoOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UserInfoOptions.prototype);
        obj.__wbg_ptr = ptr;
        UserInfoOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UserInfoOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_userinfooptions_free(ptr, 0);
    }
    /**
     * @param {string | null} [encoding]
     */
    constructor(encoding) {
        const ret = wasm.userinfooptions_new_with_values(isLikeNone(encoding) ? 0 : addHeapObject(encoding));
        this.__wbg_ptr = ret >>> 0;
        UserInfoOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {UserInfoOptions}
     */
    static new() {
        const ret = wasm.userinfooptions_new();
        return UserInfoOptions.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.userinfooptions_encoding(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.userinfooptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
}
module.exports.UserInfoOptions = UserInfoOptions;

const UtxoContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxocontext_free(ptr >>> 0, 1));
/**
 *
 * UtxoContext is a class that provides a way to track addresses activity
 * on the Kaspa network.  When an address is registered with UtxoContext
 * it aggregates all UTXO entries for that address and emits events when
 * any activity against these addresses occurs.
 *
 * UtxoContext constructor accepts {@link IUtxoContextArgs} interface that
 * can contain an optional id parameter.  If supplied, this `id` parameter
 * will be included in all notifications emitted by the UtxoContext as
 * well as included as a part of {@link ITransactionRecord} emitted when
 * transactions occur. If not provided, a random id will be generated. This id
 * typically represents an account id in the context of a wallet application.
 * The integrated Wallet API uses UtxoContext to represent wallet accounts.
 *
 * **Exchanges:** if you are building an exchange wallet, it is recommended
 * to use UtxoContext for each user account.  This way you can track and isolate
 * each user activity (use address set, balances, transaction records).
 *
 * UtxoContext maintains a real-time cumulative balance of all addresses
 * registered against it and provides balance update notification events
 * when the balance changes.
 *
 * The UtxoContext balance is comprised of 3 values:
 * - `mature`: amount of funds available for spending.
 * - `pending`: amount of funds that are being received.
 * - `outgoing`: amount of funds that are being sent but are not yet accepted by the network.
 *
 * Please see {@link IBalance} interface for more details.
 *
 * UtxoContext can be supplied as a UTXO source to the transaction {@link Generator}
 * allowing the {@link Generator} to create transactions using the
 * UTXO entries it manages.
 *
 * **IMPORTANT:** UtxoContext is meant to represent a single account.  It is not
 * designed to be used as a global UTXO manager for all addresses in a very large
 * wallet (such as an exchange wallet). For such use cases, it is recommended to
 * perform manual UTXO management by subscribing to UTXO notifications using
 * {@link RpcClient.subscribeUtxosChanged} and {@link RpcClient.getUtxosByAddresses}.
 *
 * @see {@link IUtxoContextArgs},
 * {@link UtxoProcessor},
 * {@link Generator},
 * {@link createTransactions},
 * {@link IBalance},
 * {@link IBalanceEvent},
 * {@link IPendingEvent},
 * {@link IReorgEvent},
 * {@link IStasisEvent},
 * {@link IMaturityEvent},
 * {@link IDiscoveryEvent},
 * {@link IBalanceEvent},
 * {@link ITransactionRecord}
 *
 * @category Wallet SDK
 */
class UtxoContext {

    toJSON() {
        return {
            isActive: this.isActive,
            matureLength: this.matureLength,
            balance: this.balance,
            balanceStrings: this.balanceStrings,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoContextFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxocontext_free(ptr, 0);
    }
    /**
     * @param {IUtxoContextArgs} js_value
     */
    constructor(js_value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxocontext_ctor(retptr, addHeapObject(js_value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            UtxoContextFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Performs a scan of the given addresses and registers them in the context for event notifications.
     * @param {(Address | string)[]} addresses
     * @param {bigint | null} [optional_current_daa_score]
     * @returns {Promise<void>}
     */
    trackAddresses(addresses, optional_current_daa_score) {
        const ret = wasm.utxocontext_trackAddresses(this.__wbg_ptr, addHeapObject(addresses), isLikeNone(optional_current_daa_score) ? 0 : addHeapObject(optional_current_daa_score));
        return takeObject(ret);
    }
    /**
     * Unregister a list of addresses from the context. This will stop tracking of these addresses.
     * @param {(Address | string)[]} addresses
     * @returns {Promise<void>}
     */
    unregisterAddresses(addresses) {
        const ret = wasm.utxocontext_unregisterAddresses(this.__wbg_ptr, addHeapObject(addresses));
        return takeObject(ret);
    }
    /**
     * Clear the UtxoContext.  Unregister all addresses and clear all UTXO entries.
     * IMPORTANT: This function must be manually called when disconnecting or re-connecting to the node
     * (followed by address re-registration).
     * @returns {Promise<void>}
     */
    clear() {
        const ret = wasm.utxocontext_clear(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {boolean}
     */
    get isActive() {
        const ret = wasm.utxocontext_isActive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     *
     * Returns a range of mature UTXO entries that are currently
     * managed by the UtxoContext and are available for spending.
     *
     * NOTE: This function is provided for informational purposes only.
     * **You should not manage UTXO entries manually if they are owned by UtxoContext.**
     *
     * The resulting range may be less than requested if UTXO entries
     * have been spent asynchronously by UtxoContext or by other means
     * (i.e. UtxoContext has received notification from the network that
     * UtxoEntries have been spent externally).
     *
     * UtxoEntries are kept in in the ascending sorted order by their amount.
     * @param {number} from
     * @param {number} to
     * @returns {UtxoEntryReference[]}
     */
    getMatureRange(from, to) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxocontext_getMatureRange(retptr, this.__wbg_ptr, from, to);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Obtain the length of the mature UTXO entries that are currently
     * managed by the UtxoContext.
     * @returns {number}
     */
    get matureLength() {
        const ret = wasm.utxocontext_matureLength(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Returns pending UTXO entries that are currently managed by the UtxoContext.
     * @returns {UtxoEntryReference[]}
     */
    getPending() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxocontext_getPending(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Current {@link Balance} of the UtxoContext.
     * @returns {Balance | undefined}
     */
    get balance() {
        const ret = wasm.utxocontext_balance(this.__wbg_ptr);
        return ret === 0 ? undefined : Balance.__wrap(ret);
    }
    /**
     * Current {@link BalanceStrings} of the UtxoContext.
     * @returns {BalanceStrings | undefined}
     */
    get balanceStrings() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxocontext_balanceStrings(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return r0 === 0 ? undefined : BalanceStrings.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.UtxoContext = UtxoContext;

const UtxoEntriesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxoentries_free(ptr >>> 0, 1));
/**
 * A simple collection of UTXO entries. This struct is used to
 * retain a set of UTXO entries in the WASM memory for faster
 * processing. This struct keeps a list of entries represented
 * by `UtxoEntryReference` struct. This data structure is used
 * internally by the framework, but is exposed for convenience.
 * Please consider using `UtxoContext` instead.
 * @category Wallet SDK
 */
class UtxoEntries {

    toJSON() {
        return {
            items: this.items,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoEntriesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxoentries_free(ptr, 0);
    }
    /**
     * Create a new `UtxoEntries` struct with a set of entries.
     * @param {any} js_value
     */
    constructor(js_value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxoentries_js_ctor(retptr, addHeapObject(js_value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            UtxoEntriesFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any}
     */
    get items() {
        const ret = wasm.utxoentries_get_items_as_js_array(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {any} js_value
     */
    set items(js_value) {
        try {
            wasm.utxoentries_set_items_from_js_array(this.__wbg_ptr, addBorrowedObject(js_value));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Sort the contained entries by amount. Please note that
     * this function is not intended for use with large UTXO sets
     * as it duplicates the whole contained UTXO set while sorting.
     */
    sort() {
        wasm.utxoentries_sort(this.__wbg_ptr);
    }
    /**
     * @returns {bigint}
     */
    amount() {
        const ret = wasm.utxoentries_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}
module.exports.UtxoEntries = UtxoEntries;

const UtxoEntryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxoentry_free(ptr >>> 0, 1));
/**
 * [`UtxoEntry`] struct represents a client-side UTXO entry.
 *
 * @category Wallet SDK
 */
class UtxoEntry {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UtxoEntry.prototype);
        obj.__wbg_ptr = ptr;
        UtxoEntryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            address: this.address,
            outpoint: this.outpoint,
            amount: this.amount,
            scriptPublicKey: this.scriptPublicKey,
            blockDaaScore: this.blockDaaScore,
            isCoinbase: this.isCoinbase,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoEntryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxoentry_free(ptr, 0);
    }
    /**
     * @returns {Address | undefined}
     */
    get address() {
        const ret = wasm.__wbg_get_utxoentry_address(this.__wbg_ptr);
        return ret === 0 ? undefined : Address.__wrap(ret);
    }
    /**
     * @param {Address | null} [arg0]
     */
    set address(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Address);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_utxoentry_address(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {TransactionOutpoint}
     */
    get outpoint() {
        const ret = wasm.__wbg_get_utxoentry_outpoint(this.__wbg_ptr);
        return TransactionOutpoint.__wrap(ret);
    }
    /**
     * @param {TransactionOutpoint} arg0
     */
    set outpoint(arg0) {
        _assertClass(arg0, TransactionOutpoint);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_utxoentry_outpoint(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.__wbg_get_utxoentry_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set amount(arg0) {
        wasm.__wbg_set_utxoentry_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {ScriptPublicKey}
     */
    get scriptPublicKey() {
        const ret = wasm.__wbg_get_utxoentry_scriptPublicKey(this.__wbg_ptr);
        return ScriptPublicKey.__wrap(ret);
    }
    /**
     * @param {ScriptPublicKey} arg0
     */
    set scriptPublicKey(arg0) {
        _assertClass(arg0, ScriptPublicKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_utxoentry_scriptPublicKey(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {bigint}
     */
    get blockDaaScore() {
        const ret = wasm.__wbg_get_utxoentry_blockDaaScore(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set blockDaaScore(arg0) {
        wasm.__wbg_set_utxoentry_blockDaaScore(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {boolean}
     */
    get isCoinbase() {
        const ret = wasm.__wbg_get_utxoentry_isCoinbase(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set isCoinbase(arg0) {
        wasm.__wbg_set_utxoentry_isCoinbase(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {string}
     */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxoentry_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.UtxoEntry = UtxoEntry;

const UtxoEntryReferenceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxoentryreference_free(ptr >>> 0, 1));
/**
 * [`Arc`] reference to a [`UtxoEntry`] used by the wallet subsystems.
 *
 * @category Wallet SDK
 */
class UtxoEntryReference {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UtxoEntryReference.prototype);
        obj.__wbg_ptr = ptr;
        UtxoEntryReferenceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            entry: this.entry,
            outpoint: this.outpoint,
            address: this.address,
            amount: this.amount,
            isCoinbase: this.isCoinbase,
            blockDaaScore: this.blockDaaScore,
            scriptPublicKey: this.scriptPublicKey,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoEntryReferenceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxoentryreference_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxoentryreference_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {UtxoEntry}
     */
    get entry() {
        const ret = wasm.utxoentryreference_entry(this.__wbg_ptr);
        return UtxoEntry.__wrap(ret);
    }
    /**
     * @returns {TransactionOutpoint}
     */
    get outpoint() {
        const ret = wasm.utxoentryreference_outpoint(this.__wbg_ptr);
        return TransactionOutpoint.__wrap(ret);
    }
    /**
     * @returns {Address | undefined}
     */
    get address() {
        const ret = wasm.utxoentryreference_address(this.__wbg_ptr);
        return ret === 0 ? undefined : Address.__wrap(ret);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.utxoentryreference_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {boolean}
     */
    get isCoinbase() {
        const ret = wasm.utxoentryreference_isCoinbase(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {bigint}
     */
    get blockDaaScore() {
        const ret = wasm.utxoentryreference_blockDaaScore(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {ScriptPublicKey}
     */
    get scriptPublicKey() {
        const ret = wasm.utxoentryreference_scriptPublicKey(this.__wbg_ptr);
        return ScriptPublicKey.__wrap(ret);
    }
}
module.exports.UtxoEntryReference = UtxoEntryReference;

const UtxoProcessorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxoprocessor_free(ptr >>> 0, 1));
/**
 *
 * UtxoProcessor class is the main coordinator that manages UTXO processing
 * between multiple UtxoContext instances. It acts as a bridge between the
 * Kaspa node RPC connection, address subscriptions and UtxoContext instances.
 *
 * @see {@link IUtxoProcessorArgs},
 * {@link UtxoContext},
 * {@link RpcClient},
 * {@link NetworkId},
 * {@link IConnectEvent}
 * {@link IDisconnectEvent}
 * @category Wallet SDK
 */
class UtxoProcessor {

    toJSON() {
        return {
            rpc: this.rpc,
            networkId: this.networkId,
            isActive: this.isActive,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoProcessorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxoprocessor_free(ptr, 0);
    }
    /**
     * @param {string | UtxoProcessorNotificationCallback} event
     * @param {UtxoProcessorNotificationCallback | null} [callback]
     */
    addEventListener(event, callback) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxoprocessor_addEventListener(retptr, this.__wbg_ptr, addHeapObject(event), isLikeNone(callback) ? 0 : addHeapObject(callback));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {UtxoProcessorEventType | UtxoProcessorEventType[] | string | string[]} event
     * @param {UtxoProcessorNotificationCallback | null} [callback]
     */
    removeEventListener(event, callback) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxoprocessor_removeEventListener(retptr, this.__wbg_ptr, addHeapObject(event), isLikeNone(callback) ? 0 : addHeapObject(callback));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * UtxoProcessor constructor.
     *
     *
     *
     * @see {@link IUtxoProcessorArgs}
     * @param {IUtxoProcessorArgs} js_value
     */
    constructor(js_value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxoprocessor_ctor(retptr, addHeapObject(js_value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            UtxoProcessorFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Starts the UtxoProcessor and begins processing UTXO and other notifications.
     * @returns {Promise<void>}
     */
    start() {
        const ret = wasm.utxoprocessor_start(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Stops the UtxoProcessor and ends processing UTXO and other notifications.
     * @returns {Promise<void>}
     */
    stop() {
        const ret = wasm.utxoprocessor_stop(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {RpcClient}
     */
    get rpc() {
        const ret = wasm.utxoprocessor_rpc(this.__wbg_ptr);
        return RpcClient.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get networkId() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxoprocessor_networkId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {NetworkId | string} network_id
     */
    setNetworkId(network_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxoprocessor_setNetworkId(retptr, this.__wbg_ptr, addBorrowedObject(network_id));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @returns {boolean}
     */
    get isActive() {
        const ret = wasm.utxoprocessor_isActive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     *
     * Set the coinbase transaction maturity period DAA score for a given network.
     * This controls the DAA period after which the user transactions are considered mature
     * and the wallet subsystem emits the transaction maturity event.
     *
     * @see {@link TransactionRecord}
     * @see {@link IUtxoProcessorEvent}
     *
     * @category Wallet SDK
     * @param {NetworkId | string} network_id
     * @param {bigint} value
     */
    static setCoinbaseTransactionMaturityDAA(network_id, value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxoprocessor_setCoinbaseTransactionMaturityDAA(retptr, addBorrowedObject(network_id), value);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     *
     * Set the user transaction maturity period DAA score for a given network.
     * This controls the DAA period after which the user transactions are considered mature
     * and the wallet subsystem emits the transaction maturity event.
     *
     * @see {@link TransactionRecord}
     * @see {@link IUtxoProcessorEvent}
     *
     * @category Wallet SDK
     * @param {NetworkId | string} network_id
     * @param {bigint} value
     */
    static setUserTransactionMaturityDAA(network_id, value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utxoprocessor_setUserTransactionMaturityDAA(retptr, addBorrowedObject(network_id), value);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.UtxoProcessor = UtxoProcessor;

const WalletFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wallet_free(ptr >>> 0, 1));
/**
 *
 * Wallet class is the main coordinator that manages integrated wallet operations.
 *
 * The Wallet class encapsulates {@link UtxoProcessor} and provides internal
 * account management using {@link UtxoContext} instances. It acts as a bridge
 * between the integrated Wallet subsystem providing a high-level interface
 * for wallet key and account management.
 *
 * The Rusty Kaspa is developed in Rust, and the Wallet class is a Rust implementation
 * exposed to the JavaScript/TypeScript environment using the WebAssembly (WASM32) interface.
 * As such, the Wallet implementation can be powered up using native Rust or built
 * as a WebAssembly module and used in the browser or Node.js environment.
 *
 * When using Rust native or NodeJS environment, all wallet data is stored on the local
 * filesystem.  When using WASM32 build in the web browser, the wallet data is stored
 * in the browser's `localStorage` and transaction records are stored in the `IndexedDB`.
 *
 * The Wallet API can create multiple wallet instances, however, only one wallet instance
 * can be active at a time.
 *
 * The wallet implementation is designed to be efficient and support a large number
 * of accounts. Accounts reside in storage and can be loaded and activated as needed.
 * A `loaded` account contains all account information loaded from the permanent storage
 * whereas an `active` account monitors the UTXO set and provides notifications for
 * incoming and outgoing transactions as well as balance updates.
 *
 * The Wallet API communicates with the client using resource identifiers. These include
 * account IDs, private key IDs, transaction IDs, etc. It is the responsibility of the
 * client to track these resource identifiers at runtime.
 *
 * @see {@link IWalletConfig},
 *
 * @category Wallet API
 */
class Wallet {

    toJSON() {
        return {
            rpc: this.rpc,
            isOpen: this.isOpen,
            isSynced: this.isSynced,
            descriptor: this.descriptor,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WalletFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wallet_free(ptr, 0);
    }
    /**
     * @param {IWalletConfig} config
     */
    constructor(config) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallet_constructor(retptr, addHeapObject(config));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            WalletFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {RpcClient}
     */
    get rpc() {
        const ret = wasm.wallet_rpc(this.__wbg_ptr);
        return RpcClient.__wrap(ret);
    }
    /**
     * @remarks This is a local property indicating
     * if the wallet is currently open.
     * @returns {boolean}
     */
    get isOpen() {
        const ret = wasm.wallet_isOpen(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @remarks This is a local property indicating
     * if the node is currently synced.
     * @returns {boolean}
     */
    get isSynced() {
        const ret = wasm.wallet_isSynced(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {WalletDescriptor | undefined}
     */
    get descriptor() {
        const ret = wasm.wallet_descriptor(this.__wbg_ptr);
        return ret === 0 ? undefined : WalletDescriptor.__wrap(ret);
    }
    /**
     * Check if a wallet with a given name exists.
     * @param {string | null} [name]
     * @returns {Promise<boolean>}
     */
    exists(name) {
        var ptr0 = isLikeNone(name) ? 0 : passStringToWasm0(name, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wallet_exists(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<void>}
     */
    start() {
        const ret = wasm.wallet_start(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<void>}
     */
    stop() {
        const ret = wasm.wallet_stop(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {IConnectOptions | undefined | null} [args]
     * @returns {Promise<void>}
     */
    connect(args) {
        const ret = wasm.wallet_connect(this.__wbg_ptr, isLikeNone(args) ? 0 : addHeapObject(args));
        return takeObject(ret);
    }
    /**
     * @returns {Promise<void>}
     */
    disconnect() {
        const ret = wasm.wallet_disconnect(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | WalletNotificationCallback} event
     * @param {WalletNotificationCallback | null} [callback]
     */
    addEventListener(event, callback) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallet_addEventListener(retptr, this.__wbg_ptr, addHeapObject(event), isLikeNone(callback) ? 0 : addHeapObject(callback));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {WalletEventType | WalletEventType[] | string | string[]} event
     * @param {WalletNotificationCallback | null} [callback]
     */
    removeEventListener(event, callback) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallet_removeEventListener(retptr, this.__wbg_ptr, addHeapObject(event), isLikeNone(callback) ? 0 : addHeapObject(callback));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {NetworkId | string} network_id
     */
    setNetworkId(network_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallet_setNetworkId(retptr, this.__wbg_ptr, addHeapObject(network_id));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Ping backend
     * @see {@link IBatchRequest} {@link IBatchResponse}
     * @throws `string` in case of an error.
     * @param {IBatchRequest} request
     * @returns {Promise<IBatchResponse>}
     */
    batch(request) {
        const ret = wasm.wallet_batch(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IFlushRequest} {@link IFlushResponse}
     * @throws `string` in case of an error.
     * @param {IFlushRequest} request
     * @returns {Promise<IFlushResponse>}
     */
    flush(request) {
        const ret = wasm.wallet_flush(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IRetainContextRequest} {@link IRetainContextResponse}
     * @throws `string` in case of an error.
     * @param {IRetainContextRequest} request
     * @returns {Promise<IRetainContextResponse>}
     */
    retainContext(request) {
        const ret = wasm.wallet_retainContext(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IGetStatusRequest} {@link IGetStatusResponse}
     * @throws `string` in case of an error.
     * @param {IGetStatusRequest} request
     * @returns {Promise<IGetStatusResponse>}
     */
    getStatus(request) {
        const ret = wasm.wallet_getStatus(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IWalletEnumerateRequest} {@link IWalletEnumerateResponse}
     * @throws `string` in case of an error.
     * @param {IWalletEnumerateRequest} request
     * @returns {Promise<IWalletEnumerateResponse>}
     */
    walletEnumerate(request) {
        const ret = wasm.wallet_walletEnumerate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IWalletCreateRequest} {@link IWalletCreateResponse}
     * @throws `string` in case of an error.
     * @param {IWalletCreateRequest} request
     * @returns {Promise<IWalletCreateResponse>}
     */
    walletCreate(request) {
        const ret = wasm.wallet_walletCreate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IWalletOpenRequest} {@link IWalletOpenResponse}
     * @throws `string` in case of an error.
     * @param {IWalletOpenRequest} request
     * @returns {Promise<IWalletOpenResponse>}
     */
    walletOpen(request) {
        const ret = wasm.wallet_walletOpen(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IWalletReloadRequest} {@link IWalletReloadResponse}
     * @throws `string` in case of an error.
     * @param {IWalletReloadRequest} request
     * @returns {Promise<IWalletReloadResponse>}
     */
    walletReload(request) {
        const ret = wasm.wallet_walletReload(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IWalletCloseRequest} {@link IWalletCloseResponse}
     * @throws `string` in case of an error.
     * @param {IWalletCloseRequest} request
     * @returns {Promise<IWalletCloseResponse>}
     */
    walletClose(request) {
        const ret = wasm.wallet_walletClose(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IWalletChangeSecretRequest} {@link IWalletChangeSecretResponse}
     * @throws `string` in case of an error.
     * @param {IWalletChangeSecretRequest} request
     * @returns {Promise<IWalletChangeSecretResponse>}
     */
    walletChangeSecret(request) {
        const ret = wasm.wallet_walletChangeSecret(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IWalletExportRequest} {@link IWalletExportResponse}
     * @throws `string` in case of an error.
     * @param {IWalletExportRequest} request
     * @returns {Promise<IWalletExportResponse>}
     */
    walletExport(request) {
        const ret = wasm.wallet_walletExport(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IWalletImportRequest} {@link IWalletImportResponse}
     * @throws `string` in case of an error.
     * @param {IWalletImportRequest} request
     * @returns {Promise<IWalletImportResponse>}
     */
    walletImport(request) {
        const ret = wasm.wallet_walletImport(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IPrvKeyDataEnumerateRequest} {@link IPrvKeyDataEnumerateResponse}
     * @throws `string` in case of an error.
     * @param {IPrvKeyDataEnumerateRequest} request
     * @returns {Promise<IPrvKeyDataEnumerateResponse>}
     */
    prvKeyDataEnumerate(request) {
        const ret = wasm.wallet_prvKeyDataEnumerate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IPrvKeyDataCreateRequest} {@link IPrvKeyDataCreateResponse}
     * @throws `string` in case of an error.
     * @param {IPrvKeyDataCreateRequest} request
     * @returns {Promise<IPrvKeyDataCreateResponse>}
     */
    prvKeyDataCreate(request) {
        const ret = wasm.wallet_prvKeyDataCreate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IPrvKeyDataRemoveRequest} {@link IPrvKeyDataRemoveResponse}
     * @throws `string` in case of an error.
     * @param {IPrvKeyDataRemoveRequest} request
     * @returns {Promise<IPrvKeyDataRemoveResponse>}
     */
    prvKeyDataRemove(request) {
        const ret = wasm.wallet_prvKeyDataRemove(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IPrvKeyDataGetRequest} {@link IPrvKeyDataGetResponse}
     * @throws `string` in case of an error.
     * @param {IPrvKeyDataGetRequest} request
     * @returns {Promise<IPrvKeyDataGetResponse>}
     */
    prvKeyDataGet(request) {
        const ret = wasm.wallet_prvKeyDataGet(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsEnumerateRequest} {@link IAccountsEnumerateResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsEnumerateRequest} request
     * @returns {Promise<IAccountsEnumerateResponse>}
     */
    accountsEnumerate(request) {
        const ret = wasm.wallet_accountsEnumerate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsRenameRequest} {@link IAccountsRenameResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsRenameRequest} request
     * @returns {Promise<IAccountsRenameResponse>}
     */
    accountsRename(request) {
        const ret = wasm.wallet_accountsRename(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsDiscoveryRequest} {@link IAccountsDiscoveryResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsDiscoveryRequest} request
     * @returns {Promise<IAccountsDiscoveryResponse>}
     */
    accountsDiscovery(request) {
        const ret = wasm.wallet_accountsDiscovery(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsCreateRequest} {@link IAccountsCreateResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsCreateRequest} request
     * @returns {Promise<IAccountsCreateResponse>}
     */
    accountsCreate(request) {
        const ret = wasm.wallet_accountsCreate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsEnsureDefaultRequest} {@link IAccountsEnsureDefaultResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsEnsureDefaultRequest} request
     * @returns {Promise<IAccountsEnsureDefaultResponse>}
     */
    accountsEnsureDefault(request) {
        const ret = wasm.wallet_accountsEnsureDefault(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsImportRequest} {@link IAccountsImportResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsImportRequest} request
     * @returns {Promise<IAccountsImportResponse>}
     */
    accountsImport(request) {
        const ret = wasm.wallet_accountsImport(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsActivateRequest} {@link IAccountsActivateResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsActivateRequest} request
     * @returns {Promise<IAccountsActivateResponse>}
     */
    accountsActivate(request) {
        const ret = wasm.wallet_accountsActivate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsDeactivateRequest} {@link IAccountsDeactivateResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsDeactivateRequest} request
     * @returns {Promise<IAccountsDeactivateResponse>}
     */
    accountsDeactivate(request) {
        const ret = wasm.wallet_accountsDeactivate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsGetRequest} {@link IAccountsGetResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsGetRequest} request
     * @returns {Promise<IAccountsGetResponse>}
     */
    accountsGet(request) {
        const ret = wasm.wallet_accountsGet(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsCreateNewAddressRequest} {@link IAccountsCreateNewAddressResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsCreateNewAddressRequest} request
     * @returns {Promise<IAccountsCreateNewAddressResponse>}
     */
    accountsCreateNewAddress(request) {
        const ret = wasm.wallet_accountsCreateNewAddress(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsSendRequest} {@link IAccountsSendResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsSendRequest} request
     * @returns {Promise<IAccountsSendResponse>}
     */
    accountsSend(request) {
        const ret = wasm.wallet_accountsSend(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsPskbSignRequest} {@link IAccountsPskbSignResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsPskbSignRequest} request
     * @returns {Promise<IAccountsPskbSignResponse>}
     */
    accountsPskbSign(request) {
        const ret = wasm.wallet_accountsPskbSign(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsPskbBroadcastRequest} {@link IAccountsPskbBroadcastResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsPskbBroadcastRequest} request
     * @returns {Promise<IAccountsPskbBroadcastResponse>}
     */
    accountsPskbBroadcast(request) {
        const ret = wasm.wallet_accountsPskbBroadcast(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsPskbSendRequest} {@link IAccountsPskbSendResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsPskbSendRequest} request
     * @returns {Promise<IAccountsPskbSendResponse>}
     */
    accountsPskbSend(request) {
        const ret = wasm.wallet_accountsPskbSend(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsGetUtxosRequest} {@link IAccountsGetUtxosResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsGetUtxosRequest} request
     * @returns {Promise<IAccountsGetUtxosResponse>}
     */
    accountsGetUtxos(request) {
        const ret = wasm.wallet_accountsGetUtxos(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsTransferRequest} {@link IAccountsTransferResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsTransferRequest} request
     * @returns {Promise<IAccountsTransferResponse>}
     */
    accountsTransfer(request) {
        const ret = wasm.wallet_accountsTransfer(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsEstimateRequest} {@link IAccountsEstimateResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsEstimateRequest} request
     * @returns {Promise<IAccountsEstimateResponse>}
     */
    accountsEstimate(request) {
        const ret = wasm.wallet_accountsEstimate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link ITransactionsDataGetRequest} {@link ITransactionsDataGetResponse}
     * @throws `string` in case of an error.
     * @param {ITransactionsDataGetRequest} request
     * @returns {Promise<ITransactionsDataGetResponse>}
     */
    transactionsDataGet(request) {
        const ret = wasm.wallet_transactionsDataGet(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link ITransactionsReplaceNoteRequest} {@link ITransactionsReplaceNoteResponse}
     * @throws `string` in case of an error.
     * @param {ITransactionsReplaceNoteRequest} request
     * @returns {Promise<ITransactionsReplaceNoteResponse>}
     */
    transactionsReplaceNote(request) {
        const ret = wasm.wallet_transactionsReplaceNote(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link ITransactionsReplaceMetadataRequest} {@link ITransactionsReplaceMetadataResponse}
     * @throws `string` in case of an error.
     * @param {ITransactionsReplaceMetadataRequest} request
     * @returns {Promise<ITransactionsReplaceMetadataResponse>}
     */
    transactionsReplaceMetadata(request) {
        const ret = wasm.wallet_transactionsReplaceMetadata(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAddressBookEnumerateRequest} {@link IAddressBookEnumerateResponse}
     * @throws `string` in case of an error.
     * @param {IAddressBookEnumerateRequest} request
     * @returns {Promise<IAddressBookEnumerateResponse>}
     */
    addressBookEnumerate(request) {
        const ret = wasm.wallet_addressBookEnumerate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IFeeRateEstimateRequest} {@link IFeeRateEstimateResponse}
     * @throws `string` in case of an error.
     * @param {IFeeRateEstimateRequest} request
     * @returns {Promise<IFeeRateEstimateResponse>}
     */
    feeRateEstimate(request) {
        const ret = wasm.wallet_feeRateEstimate(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IFeeRatePollerEnableRequest} {@link IFeeRatePollerEnableResponse}
     * @throws `string` in case of an error.
     * @param {IFeeRatePollerEnableRequest} request
     * @returns {Promise<IFeeRatePollerEnableResponse>}
     */
    feeRatePollerEnable(request) {
        const ret = wasm.wallet_feeRatePollerEnable(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IFeeRatePollerDisableRequest} {@link IFeeRatePollerDisableResponse}
     * @throws `string` in case of an error.
     * @param {IFeeRatePollerDisableRequest} request
     * @returns {Promise<IFeeRatePollerDisableResponse>}
     */
    feeRatePollerDisable(request) {
        const ret = wasm.wallet_feeRatePollerDisable(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsCommitRevealRequest} {@link IAccountsCommitRevealResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsCommitRevealRequest} request
     * @returns {Promise<IAccountsCommitRevealResponse>}
     */
    accountsCommitReveal(request) {
        const ret = wasm.wallet_accountsCommitReveal(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
    /**
     * @see {@link IAccountsCommitRevealManualRequest} {@link IAccountsCommitRevealManualResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsCommitRevealManualRequest} request
     * @returns {Promise<IAccountsCommitRevealManualResponse>}
     */
    accountsCommitRevealManual(request) {
        const ret = wasm.wallet_accountsCommitRevealManual(this.__wbg_ptr, addHeapObject(request));
        return takeObject(ret);
    }
}
module.exports.Wallet = Wallet;

const WalletDescriptorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_walletdescriptor_free(ptr >>> 0, 1));
/**
 * @category Wallet API
 */
class WalletDescriptor {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WalletDescriptor.prototype);
        obj.__wbg_ptr = ptr;
        WalletDescriptorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            title: this.title,
            filename: this.filename,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WalletDescriptorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_walletdescriptor_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get title() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_walletdescriptor_title(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string | null} [arg0]
     */
    set title(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_walletdescriptor_title(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    get filename() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_walletdescriptor_filename(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set filename(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_walletdescriptor_filename(this.__wbg_ptr, ptr0, len0);
    }
}
module.exports.WalletDescriptor = WalletDescriptor;

const WasiOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasioptions_free(ptr >>> 0, 1));

class WasiOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasiOptions.prototype);
        obj.__wbg_ptr = ptr;
        WasiOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasiOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasioptions_free(ptr, 0);
    }
    /**
     * @param {any[] | null | undefined} args
     * @param {object | null | undefined} env
     * @param {object} preopens
     */
    constructor(args, env, preopens) {
        var ptr0 = isLikeNone(args) ? 0 : passArrayJsValueToWasm0(args, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasioptions_new_with_values(ptr0, len0, isLikeNone(env) ? 0 : addHeapObject(env), addHeapObject(preopens));
        this.__wbg_ptr = ret >>> 0;
        WasiOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {object} preopens
     * @returns {WasiOptions}
     */
    static new(preopens) {
        const ret = wasm.wasioptions_new(addHeapObject(preopens));
        return WasiOptions.__wrap(ret);
    }
    /**
     * @returns {any[] | undefined}
     */
    get args() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasioptions_args(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getArrayJsValueFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any[] | null} [value]
     */
    set args(value) {
        var ptr0 = isLikeNone(value) ? 0 : passArrayJsValueToWasm0(value, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        wasm.wasioptions_set_args(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {object | undefined}
     */
    get env() {
        const ret = wasm.wasioptions_env(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {object | null} [value]
     */
    set env(value) {
        wasm.wasioptions_set_env(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {object}
     */
    get preopens() {
        const ret = wasm.wasioptions_preopens(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {object} value
     */
    set preopens(value) {
        wasm.wasioptions_set_preopens(this.__wbg_ptr, addHeapObject(value));
    }
}
module.exports.WasiOptions = WasiOptions;

const WriteFileSyncOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_writefilesyncoptions_free(ptr >>> 0, 1));

class WriteFileSyncOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WriteFileSyncOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_writefilesyncoptions_free(ptr, 0);
    }
    /**
     * @param {string | null} [encoding]
     * @param {string | null} [flag]
     * @param {number | null} [mode]
     */
    constructor(encoding, flag, mode) {
        const ret = wasm.writefilesyncoptions_new(isLikeNone(encoding) ? 0 : addHeapObject(encoding), isLikeNone(flag) ? 0 : addHeapObject(flag), isLikeNone(mode) ? 0x100000001 : (mode) >>> 0);
        this.__wbg_ptr = ret >>> 0;
        WriteFileSyncOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.writefilesyncoptions_encoding(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.writefilesyncoptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {string | undefined}
     */
    get flag() {
        const ret = wasm.writefilesyncoptions_flag(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {string | null} [value]
     */
    set flag(value) {
        wasm.writefilesyncoptions_set_flag(this.__wbg_ptr, isLikeNone(value) ? 0 : addHeapObject(value));
    }
    /**
     * @returns {number | undefined}
     */
    get mode() {
        const ret = wasm.writefilesyncoptions_mode(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number | null} [value]
     */
    set mode(value) {
        wasm.writefilesyncoptions_set_mode(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
}
module.exports.WriteFileSyncOptions = WriteFileSyncOptions;

const WriteStreamFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_writestream_free(ptr >>> 0, 1));

class WriteStream {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WriteStreamFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_writestream_free(ptr, 0);
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    add_listener_with_open(listener) {
        try {
            const ret = wasm.writestream_add_listener_with_open(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    add_listener_with_close(listener) {
        try {
            const ret = wasm.writestream_add_listener_with_close(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    on_with_open(listener) {
        try {
            const ret = wasm.writestream_on_with_open(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    on_with_close(listener) {
        try {
            const ret = wasm.writestream_on_with_close(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    once_with_open(listener) {
        try {
            const ret = wasm.writestream_once_with_open(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    once_with_close(listener) {
        try {
            const ret = wasm.writestream_once_with_close(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_listener_with_open(listener) {
        try {
            const ret = wasm.writestream_prepend_listener_with_open(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_listener_with_close(listener) {
        try {
            const ret = wasm.writestream_prepend_listener_with_close(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_once_listener_with_open(listener) {
        try {
            const ret = wasm.writestream_prepend_once_listener_with_open(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_once_listener_with_close(listener) {
        try {
            const ret = wasm.writestream_prepend_once_listener_with_close(this.__wbg_ptr, addBorrowedObject(listener));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.WriteStream = WriteStream;

const XOnlyPublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_xonlypublickey_free(ptr >>> 0, 1));
/**
 *
 * Data structure that envelopes a XOnlyPublicKey.
 *
 * XOnlyPublicKey is used as a payload part of the {@link Address}.
 *
 * @see {@link PublicKey}
 * @category Wallet SDK
 */
class XOnlyPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(XOnlyPublicKey.prototype);
        obj.__wbg_ptr = ptr;
        XOnlyPublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        XOnlyPublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_xonlypublickey_free(ptr, 0);
    }
    /**
     * @param {string} key
     */
    constructor(key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(key, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.xonlypublickey_try_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            XOnlyPublicKeyFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xonlypublickey_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the [`Address`] of this XOnlyPublicKey.
     * Receives a [`NetworkType`] to determine the prefix of the address.
     * JavaScript: `let address = xOnlyPublicKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddress(network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xonlypublickey_toAddress(retptr, this.__wbg_ptr, addBorrowedObject(network));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Get `ECDSA` [`Address`] of this XOnlyPublicKey.
     * Receives a [`NetworkType`] to determine the prefix of the address.
     * JavaScript: `let address = xOnlyPublicKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddressECDSA(network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xonlypublickey_toAddressECDSA(retptr, this.__wbg_ptr, addBorrowedObject(network));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {Address} address
     * @returns {XOnlyPublicKey}
     */
    static fromAddress(address) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(address, Address);
            wasm.xonlypublickey_fromAddress(retptr, address.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return XOnlyPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.XOnlyPublicKey = XOnlyPublicKey;

const XPrvFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_xprv_free(ptr >>> 0, 1));
/**
 *
 * Extended private key (XPrv).
 *
 * This class allows accepts a master seed and provides
 * functions for derivation of dependent child private keys.
 *
 * Please note that Kaspa extended private keys use `kprv` prefix.
 *
 * @see {@link PrivateKeyGenerator}, {@link PublicKeyGenerator}, {@link XPub}, {@link Mnemonic}
 * @category Wallet SDK
 */
class XPrv {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(XPrv.prototype);
        obj.__wbg_ptr = ptr;
        XPrvFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            xprv: this.xprv,
            privateKey: this.privateKey,
            depth: this.depth,
            parentFingerprint: this.parentFingerprint,
            childNumber: this.childNumber,
            chainCode: this.chainCode,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        XPrvFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_xprv_free(ptr, 0);
    }
    /**
     * @param {HexString} seed
     */
    constructor(seed) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xprv_try_new(retptr, addHeapObject(seed));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            XPrvFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create {@link XPrv} from `xprvxxxx..` string
     * @param {string} xprv
     * @returns {XPrv}
     */
    static fromXPrv(xprv) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(xprv, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.xprv_fromXPrv(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return XPrv.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} child_number
     * @param {boolean | null} [hardened]
     * @returns {XPrv}
     */
    deriveChild(child_number, hardened) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xprv_deriveChild(retptr, this.__wbg_ptr, child_number, isLikeNone(hardened) ? 0xFFFFFF : hardened ? 1 : 0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return XPrv.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} path
     * @returns {XPrv}
     */
    derivePath(path) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xprv_derivePath(retptr, this.__wbg_ptr, addBorrowedObject(path));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return XPrv.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    intoString(prefix) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.xprv_intoString(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xprv_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {XPub}
     */
    toXPub() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xprv_toXPub(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return XPub.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {PrivateKey}
     */
    toPrivateKey() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xprv_toPrivateKey(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return PrivateKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    get xprv() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xprv_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get privateKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xprv_privateKey(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get depth() {
        const ret = wasm.xprv_depth(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get parentFingerprint() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xprv_parentFingerprint(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get childNumber() {
        const ret = wasm.xprv_childNumber(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    get chainCode() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xprv_chainCode(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.XPrv = XPrv;

const XPubFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_xpub_free(ptr >>> 0, 1));
/**
 *
 * Extended public key (XPub).
 *
 * This class allows accepts another XPub and and provides
 * functions for derivation of dependent child public keys.
 *
 * Please note that Kaspa extended public keys use `kpub` prefix.
 *
 * @see {@link PrivateKeyGenerator}, {@link PublicKeyGenerator}, {@link XPrv}, {@link Mnemonic}
 * @category Wallet SDK
 */
class XPub {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(XPub.prototype);
        obj.__wbg_ptr = ptr;
        XPubFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            xpub: this.xpub,
            depth: this.depth,
            parentFingerprint: this.parentFingerprint,
            childNumber: this.childNumber,
            chainCode: this.chainCode,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        XPubFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_xpub_free(ptr, 0);
    }
    /**
     * @param {string} xpub
     */
    constructor(xpub) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(xpub, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.xpub_try_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            XPubFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} child_number
     * @param {boolean | null} [hardened]
     * @returns {XPub}
     */
    deriveChild(child_number, hardened) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xpub_deriveChild(retptr, this.__wbg_ptr, child_number, isLikeNone(hardened) ? 0xFFFFFF : hardened ? 1 : 0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return XPub.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} path
     * @returns {XPub}
     */
    derivePath(path) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xpub_derivePath(retptr, this.__wbg_ptr, addBorrowedObject(path));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return XPub.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    intoString(prefix) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.xpub_intoString(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * @returns {PublicKey}
     */
    toPublicKey() {
        const ret = wasm.xpub_toPublicKey(this.__wbg_ptr);
        return PublicKey.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    get xpub() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xpub_xpub(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get depth() {
        const ret = wasm.xpub_depth(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get parentFingerprint() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xpub_parentFingerprint(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get childNumber() {
        const ret = wasm.xpub_childNumber(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    get chainCode() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.xpub_chainCode(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.XPub = XPub;

module.exports.__wbg_BigInt_470dd987b8190f8e = function(arg0) {
    const ret = BigInt(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_BigInt_ddea6d2f55558acb = function() { return handleError(function (arg0) {
    const ret = BigInt(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_String_8f0eb39a4a4c2f66 = function(arg0, arg1) {
    const ret = String(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbg_Window_b0044ac7db258535 = function(arg0) {
    const ret = getObject(arg0).Window;
    return addHeapObject(ret);
};

module.exports.__wbg_WorkerGlobalScope_b74cefefc62a37da = function(arg0) {
    const ret = getObject(arg0).WorkerGlobalScope;
    return addHeapObject(ret);
};

module.exports.__wbg_abort_775ef1d17fc65868 = function(arg0) {
    getObject(arg0).abort();
};

module.exports.__wbg_aborted_new = function(arg0) {
    const ret = Aborted.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_accountkind_new = function(arg0) {
    const ret = AccountKind.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_addListener_d78339dd4535b756 = function(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).addListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    return addHeapObject(ret);
};

module.exports.__wbg_address_new = function(arg0) {
    const ret = Address.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_advance_b3ccc91b80962d79 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).advance(arg1 >>> 0);
}, arguments) };

module.exports.__wbg_appendChild_8204974b7328bf98 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).appendChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_append_8c7dd8d641a5f01b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

module.exports.__wbg_body_942ea927546a04ba = function(arg0) {
    const ret = getObject(arg0).body;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

module.exports.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_cancelAnimationFrame_032049cb190240a7 = function(arg0) {
    cancelAnimationFrame(takeObject(arg0));
};

module.exports.__wbg_clearInterval_d472232e2fb5e5e4 = function() { return handleError(function (arg0) {
    clearInterval(getObject(arg0));
}, arguments) };

module.exports.__wbg_clearTimeout_c5ac0f4b6a07b59e = function() { return handleError(function (arg0) {
    clearTimeout(getObject(arg0));
}, arguments) };

module.exports.__wbg_close_0880036443561527 = function() { return handleError(function (arg0) {
    getObject(arg0).close();
}, arguments) };

module.exports.__wbg_continue_c46c11d3dbe1b030 = function() { return handleError(function (arg0) {
    getObject(arg0).continue();
}, arguments) };

module.exports.__wbg_count_613cb921d67a4f26 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).count();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_createElement_8c9931a732ee2fea = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_createIndex_873ac48adc772309 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    const ret = getObject(arg0).createIndex(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_createObjectStore_e566459f7161f82f = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).createObjectStore(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_createObjectURL_6e98d2f9c7bd9764 = function() { return handleError(function (arg0, arg1) {
    const ret = URL.createObjectURL(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

module.exports.__wbg_crypto_ed58b8e10a292839 = function(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

module.exports.__wbg_data_432d9c3df2630942 = function(arg0) {
    const ret = getObject(arg0).data;
    return addHeapObject(ret);
};

module.exports.__wbg_delete_200677093b4cf756 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).delete(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_delete_36c8630e530a2a1a = function(arg0, arg1) {
    const ret = getObject(arg0).delete(getObject(arg1));
    return ret;
};

module.exports.__wbg_document_d249400bd7bd996d = function(arg0) {
    const ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_done_769e5ede4b31c67b = function(arg0) {
    const ret = getObject(arg0).done;
    return ret;
};

module.exports.__wbg_entries_3265d4158b33e5dc = function(arg0) {
    const ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_entries_c8a90a7ed73e84ce = function(arg0) {
    const ret = getObject(arg0).entries();
    return addHeapObject(ret);
};

module.exports.__wbg_error_5edc95999c70d386 = function(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_export_3(deferred0_0, deferred0_1, 1);
    }
};

module.exports.__wbg_error_b5d62a6100a65a3b = function(arg0, arg1) {
    console.error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbg_error_ff4ddaabdfc5dbb3 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).error;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

module.exports.__wbg_existsSync_6b2031627aea3e5a = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).existsSync(getStringFromWasm0(arg1, arg2));
    return ret;
}, arguments) };

module.exports.__wbg_fetch_509096533071c657 = function(arg0, arg1) {
    const ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_fetch_7bb58c5ed3c31810 = function(arg0) {
    const ret = fetch(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_fromCodePoint_f37c25c172f2e8b5 = function() { return handleError(function (arg0) {
    const ret = String.fromCodePoint(arg0 >>> 0);
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_from_2a5d3e218e67aa85 = function(arg0) {
    const ret = Array.from(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_from_d608a04300bfd9ac = function(arg0) {
    const ret = Buffer.from(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_generatorsummary_new = function(arg0) {
    const ret = GeneratorSummary.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_getItem_17f98dee3b43fa7e = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg1).getItem(getStringFromWasm0(arg2, arg3));
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

module.exports.__wbg_getRandomValues_bcb4912f16000dc4 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

module.exports.__wbg_get_13495dac72693ecc = function(arg0, arg1) {
    const ret = getObject(arg0).get(getObject(arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_get_8da03f81f6a1111e = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).get(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_get_a8e28596722a45ff = function() { return handleError(function (arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        const ret = chrome.storage.local.get(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    } finally {
        wasm.__wbindgen_export_3(deferred0_0, deferred0_1, 1);
    }
}, arguments) };

module.exports.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

module.exports.__wbg_get_f1f75752f252b231 = function() { return handleError(function () {
    const ret = chrome.storage.local.get();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_getwithrefkey_1dc361bd10053bfe = function(arg0, arg1) {
    const ret = getObject(arg0)[getObject(arg1)];
    return addHeapObject(ret);
};

module.exports.__wbg_global_b6f5c73312f62313 = function(arg0) {
    const ret = getObject(arg0).global;
    return addHeapObject(ret);
};

module.exports.__wbg_has_a5ea9117f258a0ec = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.has(getObject(arg0), getObject(arg1));
    return ret;
}, arguments) };

module.exports.__wbg_hash_new = function(arg0) {
    const ret = Hash.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_headers_9cb51cfd2ac780a4 = function(arg0) {
    const ret = getObject(arg0).headers;
    return addHeapObject(ret);
};

module.exports.__wbg_index_e00ca5fff206ee3e = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).index(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_indexedDB_601ec26c63e333de = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).indexedDB;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

module.exports.__wbg_indexedDB_b1f49280282046f8 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).indexedDB;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

module.exports.__wbg_indexedDB_f6b47b0dc333fd2f = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).indexedDB;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

module.exports.__wbg_innerHTML_e1553352fe93921a = function(arg0, arg1) {
    const ret = getObject(arg1).innerHTML;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_instanceof_Map_f3469ce2244d2430 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Map;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_instanceof_Object_7f2dcef8f78644a4 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Object;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_instanceof_Response_f2cc20d9f7dfd644 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Response;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
    const ret = Array.isArray(getObject(arg0));
    return ret;
};

module.exports.__wbg_isSafeInteger_343e2beeeece1bb0 = function(arg0) {
    const ret = Number.isSafeInteger(getObject(arg0));
    return ret;
};

module.exports.__wbg_is_c7481c65e7e5df9e = function(arg0, arg1) {
    const ret = Object.is(getObject(arg0), getObject(arg1));
    return ret;
};

module.exports.__wbg_iterator_9a24c88df860dc65 = function() {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
};

module.exports.__wbg_key_c5e0a01cf450dca2 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg1).key(arg2 >>> 0);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

module.exports.__wbg_keys_5c77a08ddc2fb8a6 = function(arg0) {
    const ret = Object.keys(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_length_a446193dc22c12f8 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

module.exports.__wbg_length_e2d2a49132c1b256 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

module.exports.__wbg_length_ed4a84b02b798bda = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).length;
    return ret;
}, arguments) };

module.exports.__wbg_localStorage_1406c99c39728187 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).localStorage;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

module.exports.__wbg_location_350d99456c2f3693 = function(arg0) {
    const ret = getObject(arg0).location;
    return addHeapObject(ret);
};

module.exports.__wbg_log_6c164928aa7b57f4 = function(arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbg_mkdirSync_29d1fd92bf140bd0 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    getObject(arg0).mkdirSync(getStringFromWasm0(arg1, arg2), takeObject(arg3));
}, arguments) };

module.exports.__wbg_msCrypto_0a36e2ec3a343d26 = function(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

module.exports.__wbg_navigator_1577371c070c8947 = function(arg0) {
    const ret = getObject(arg0).navigator;
    return addHeapObject(ret);
};

module.exports.__wbg_networkid_new = function(arg0) {
    const ret = NetworkId.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_new0_f788a2397c7ca929 = function() {
    const ret = new Date();
    return addHeapObject(ret);
};

module.exports.__wbg_new_018dcc2d6c8c2f6a = function() { return handleError(function () {
    const ret = new Headers();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_new_0b790fd655ff1a97 = function() { return handleError(function (arg0, arg1) {
    const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_199(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

module.exports.__wbg_new_405e22f390576ce2 = function() {
    const ret = new Object();
    return addHeapObject(ret);
};

module.exports.__wbg_new_5e0be73521bc8c17 = function() {
    const ret = new Map();
    return addHeapObject(ret);
};

module.exports.__wbg_new_757fd34d47ff40d2 = function(arg0) {
    const ret = new ArrayBuffer(arg0 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_new_78feb108b6472713 = function() {
    const ret = new Array();
    return addHeapObject(ret);
};

module.exports.__wbg_new_a12002a7f91c75be = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_new_b1a33e5095abf678 = function() { return handleError(function (arg0, arg1) {
    const ret = new Worker(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_new_e25e5aab09ff45db = function() { return handleError(function () {
    const ret = new AbortController();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_new_f5f8a7325e1cb479 = function() {
    const ret = new Error();
    return addHeapObject(ret);
};

module.exports.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_newwithnodejsconfigimpl_b0a2d4e5b0763676 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    const ret = new WebSocket(getStringFromWasm0(arg0, arg1), takeObject(arg2), takeObject(arg3), takeObject(arg4), takeObject(arg5), takeObject(arg6));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_newwithstrandinit_06c535e0a867c635 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_newwithstrsequenceandoptions_aaff55b467c81b63 = function() { return handleError(function (arg0, arg1) {
    const ret = new Blob(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_next_25feadfc0913fea9 = function(arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
};

module.exports.__wbg_next_6574e1a8a62d1055 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_node_02999533c4ea02e3 = function(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
};

module.exports.__wbg_nodedescriptor_new = function(arg0) {
    const ret = NodeDescriptor.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_now_807e54c39636c349 = function() {
    const ret = Date.now();
    return ret;
};

module.exports.__wbg_now_d18023d54d4e5500 = function(arg0) {
    const ret = getObject(arg0).now();
    return ret;
};

module.exports.__wbg_objectStore_21878d46d25b64b6 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).objectStore(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_oldVersion_e8337811e52861c6 = function(arg0) {
    const ret = getObject(arg0).oldVersion;
    return ret;
};

module.exports.__wbg_on_9ef8de87725b93b5 = function(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).on(getStringFromWasm0(arg1, arg2), getObject(arg3));
    return addHeapObject(ret);
};

module.exports.__wbg_once_8901720a31f56808 = function(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).once(getStringFromWasm0(arg1, arg2), getObject(arg3));
    return addHeapObject(ret);
};

module.exports.__wbg_openCursor_d8ea5d621ec422f8 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).openCursor(getObject(arg1), __wbindgen_enum_IdbCursorDirection[arg2]);
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_open_e0c0b2993eb596e1 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).open(getStringFromWasm0(arg1, arg2), arg3 >>> 0);
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_pendingtransaction_new = function(arg0) {
    const ret = PendingTransaction.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_postMessage_6edafa8f7b9c2f52 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).postMessage(getObject(arg1));
}, arguments) };

module.exports.__wbg_prependListener_dc1e8b094d0f731e = function(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).prependListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    return addHeapObject(ret);
};

module.exports.__wbg_prependOnceListener_93873dc17dd2fcad = function(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).prependOnceListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    return addHeapObject(ret);
};

module.exports.__wbg_process_5c1d670bc53614b8 = function(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
};

module.exports.__wbg_protocol_faa0494a9b2554cb = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).protocol;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

module.exports.__wbg_publickey_new = function(arg0) {
    const ret = PublicKey.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_push_737cfc8c1432c2c6 = function(arg0, arg1) {
    const ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

module.exports.__wbg_put_066faa31a6a88f5b = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).put(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
    queueMicrotask(getObject(arg0));
};

module.exports.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
    const ret = getObject(arg0).queueMicrotask;
    return addHeapObject(ret);
};

module.exports.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).randomFillSync(takeObject(arg1));
}, arguments) };

module.exports.__wbg_readFileSync_42b340d959241f2b = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).readFileSync(getStringFromWasm0(arg1, arg2), takeObject(arg3));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_readdir_319d9b13a44c9af9 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).readdir(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_readyState_4013cfdf4f22afb0 = function(arg0) {
    const ret = getObject(arg0).readyState;
    return (__wbindgen_enum_IdbRequestReadyState.indexOf(ret) + 1 || 3) - 1;
};

module.exports.__wbg_readyState_6c28968f3e6c1e47 = function(arg0) {
    const ret = getObject(arg0).readyState;
    return ret;
};

module.exports.__wbg_removeAttribute_e419cd6726b4c62f = function() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).removeAttribute(getStringFromWasm0(arg1, arg2));
}, arguments) };

module.exports.__wbg_removeItem_9d2669ee3bba6f7d = function() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).removeItem(getStringFromWasm0(arg1, arg2));
}, arguments) };

module.exports.__wbg_remove_cb9af65ab98197c5 = function() { return handleError(function (arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        const ret = chrome.storage.local.remove(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    } finally {
        wasm.__wbindgen_export_3(deferred0_0, deferred0_1, 1);
    }
}, arguments) };

module.exports.__wbg_renameSync_86e78b84a05e4a0b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).renameSync(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

module.exports.__wbg_requestAnimationFrame_63a812187303a02c = function(arg0) {
    const ret = requestAnimationFrame(takeObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_require_05f2f70e92254dbb = function(arg0, arg1) {
    const ret = require(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_require_11fc9008c54f5b90 = function(arg0, arg1) {
    const ret = require(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_require_79b1e9274cde3c87 = function() { return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_resolve_4851785c9c5f573d = function(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_result_f29afabdf2c05826 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).result;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_rpcclient_new = function(arg0) {
    const ret = RpcClient.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_send_17f8c8c8e084cc5e = function() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).send(getArrayU8FromWasm0(arg1, arg2));
}, arguments) };

module.exports.__wbg_send_9a57107cc0d7eafa = function() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).send(getStringFromWasm0(arg1, arg2));
}, arguments) };

module.exports.__wbg_send_afb0c27f2d9698e3 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).send(getObject(arg1));
}, arguments) };

module.exports.__wbg_setAttribute_2704501201f15687 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

module.exports.__wbg_setInterval_160c4baec24e25f6 = function() { return handleError(function (arg0, arg1) {
    const ret = setInterval(getObject(arg0), arg1 >>> 0);
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_setItem_212ecc915942ab0a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).setItem(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

module.exports.__wbg_setTime_8afa2faa26e7eb59 = function(arg0, arg1) {
    const ret = getObject(arg0).setTime(arg1);
    return ret;
};

module.exports.__wbg_setTimeout_430dd4984e76f6c3 = function() { return handleError(function (arg0, arg1) {
    const ret = setTimeout(getObject(arg0), arg1 >>> 0);
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_set_005c36bbcfafb768 = function() { return handleError(function (arg0) {
    const ret = chrome.storage.local.set(takeObject(arg0));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_set_37837023f3d740e8 = function(arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
};

module.exports.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};

module.exports.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

module.exports.__wbg_set_8fc6bf8a5b1071d1 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

module.exports.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };

module.exports.__wbg_setbinaryType_9981a6ba2bd58b94 = function(arg0, arg1) {
    getObject(arg0).binaryType = __wbindgen_enum_BinaryType[arg1];
};

module.exports.__wbg_setbody_5923b78a95eedf29 = function(arg0, arg1) {
    getObject(arg0).body = getObject(arg1);
};

module.exports.__wbg_setcredentials_c3a22f1cd105a2c6 = function(arg0, arg1) {
    getObject(arg0).credentials = __wbindgen_enum_RequestCredentials[arg1];
};

module.exports.__wbg_setheaders_834c0bdb6a8949ad = function(arg0, arg1) {
    getObject(arg0).headers = getObject(arg1);
};

module.exports.__wbg_setinnerHTML_31bde41f835786f7 = function(arg0, arg1, arg2) {
    getObject(arg0).innerHTML = getStringFromWasm0(arg1, arg2);
};

module.exports.__wbg_setmethod_3c5280fe5d890842 = function(arg0, arg1, arg2) {
    getObject(arg0).method = getStringFromWasm0(arg1, arg2);
};

module.exports.__wbg_setmode_5dc300b865044b65 = function(arg0, arg1) {
    getObject(arg0).mode = __wbindgen_enum_RequestMode[arg1];
};

module.exports.__wbg_setonabort_3bf4db6614fa98e9 = function(arg0, arg1) {
    getObject(arg0).onabort = getObject(arg1);
};

module.exports.__wbg_setonblocked_aebf64bd39f1eca8 = function(arg0, arg1) {
    getObject(arg0).onblocked = getObject(arg1);
};

module.exports.__wbg_setonclose_b15bdabd419b6357 = function(arg0, arg1) {
    getObject(arg0).onclose = getObject(arg1);
};

module.exports.__wbg_setoncomplete_4d19df0dadb7c4d4 = function(arg0, arg1) {
    getObject(arg0).oncomplete = getObject(arg1);
};

module.exports.__wbg_setonerror_b0d9d723b8fddbbb = function(arg0, arg1) {
    getObject(arg0).onerror = getObject(arg1);
};

module.exports.__wbg_setonerror_d7e3056cc6e56085 = function(arg0, arg1) {
    getObject(arg0).onerror = getObject(arg1);
};

module.exports.__wbg_setonerror_e2c5c0fa6fbf6d99 = function(arg0, arg1) {
    getObject(arg0).onerror = getObject(arg1);
};

module.exports.__wbg_setonmessage_007594843a0b97e8 = function(arg0, arg1) {
    getObject(arg0).onmessage = getObject(arg1);
};

module.exports.__wbg_setonmessage_5a885b16bdc6dca6 = function(arg0, arg1) {
    getObject(arg0).onmessage = getObject(arg1);
};

module.exports.__wbg_setonopen_c42cfdbb28b087c4 = function(arg0, arg1) {
    getObject(arg0).onopen = getObject(arg1);
};

module.exports.__wbg_setonsuccess_afa464ee777a396d = function(arg0, arg1) {
    getObject(arg0).onsuccess = getObject(arg1);
};

module.exports.__wbg_setonupgradeneeded_fcf7ce4f2eb0cb5f = function(arg0, arg1) {
    getObject(arg0).onupgradeneeded = getObject(arg1);
};

module.exports.__wbg_setonversionchange_6ee07fa49ee1e3a5 = function(arg0, arg1) {
    getObject(arg0).onversionchange = getObject(arg1);
};

module.exports.__wbg_setsignal_75b21ef3a81de905 = function(arg0, arg1) {
    getObject(arg0).signal = getObject(arg1);
};

module.exports.__wbg_settype_39ed370d3edd403c = function(arg0, arg1, arg2) {
    getObject(arg0).type = getStringFromWasm0(arg1, arg2);
};

module.exports.__wbg_setunique_dd24c422aa05df89 = function(arg0, arg1) {
    getObject(arg0).unique = arg1 !== 0;
};

module.exports.__wbg_signal_aaf9ad74119f20a4 = function(arg0) {
    const ret = getObject(arg0).signal;
    return addHeapObject(ret);
};

module.exports.__wbg_stack_c99a96ed42647c4c = function(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbg_statSync_9a429acc496bafda = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).statSync(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_status_f6360336ca686bf0 = function(arg0) {
    const ret = getObject(arg0).status;
    return ret;
};

module.exports.__wbg_stringify_f7ed6987935b4a24 = function() { return handleError(function (arg0) {
    const ret = JSON.stringify(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_target_0a62d9d79a2a1ede = function(arg0) {
    const ret = getObject(arg0).target;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_text_7805bea50de2af49 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).text();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

module.exports.__wbg_toString_2f76f493957b63da = function(arg0, arg1, arg2) {
    const ret = getObject(arg1).toString(arg2);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbg_toString_b5d4438bc26b267c = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).toString(arg1);
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_transaction_babc423936946a37 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).transaction(getStringFromWasm0(arg1, arg2), __wbindgen_enum_IdbTransactionMode[arg3]);
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_transaction_new = function(arg0) {
    const ret = Transaction.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_transactioninput_new = function(arg0) {
    const ret = TransactionInput.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_transactionoutput_new = function(arg0) {
    const ret = TransactionOutput.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_transactionrecordnotification_new = function(arg0) {
    const ret = TransactionRecordNotification.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_unlinkSync_656392e8d747415f = function() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).unlinkSync(getStringFromWasm0(arg1, arg2));
}, arguments) };

module.exports.__wbg_update_acd72607f506872a = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).update(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_url_ae10c34ca209681d = function(arg0, arg1) {
    const ret = getObject(arg1).url;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbg_userAgent_12e9d8e62297563f = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).userAgent;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

module.exports.__wbg_utxoentryreference_new = function(arg0) {
    const ret = UtxoEntryReference.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_value_68c4e9a54bb7fd5e = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
};

module.exports.__wbg_versions_c71aa1626a93e0a1 = function(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
};

module.exports.__wbg_walletdescriptor_new = function(arg0) {
    const ret = WalletDescriptor.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_warn_28319e260c89a4f8 = function(arg0, arg1) {
    console.warn(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbg_writeFileSync_6325b339950ab342 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).writeFileSync(getStringFromWasm0(arg1, arg2), takeObject(arg3), takeObject(arg4));
}, arguments) };

module.exports.__wbindgen_array_new = function() {
    const ret = [];
    return addHeapObject(ret);
};

module.exports.__wbindgen_array_push = function(arg0, arg1) {
    getObject(arg0).push(takeObject(arg1));
};

module.exports.__wbindgen_as_number = function(arg0) {
    const ret = +getObject(arg0);
    return ret;
};

module.exports.__wbindgen_bigint_from_i64 = function(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

module.exports.__wbindgen_bigint_from_u64 = function(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
    const v = getObject(arg1);
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

module.exports.__wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

module.exports.__wbindgen_cb_drop = function(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

module.exports.__wbindgen_closure_wrapper16385 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 6406, __wbg_adapter_78);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper17150 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 6436, __wbg_adapter_81);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper17152 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 6436, __wbg_adapter_84);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper17154 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 6436, __wbg_adapter_87);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper17515 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 6560, __wbg_adapter_90);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper17516 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 6560, __wbg_adapter_90);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper4216 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1320, __wbg_adapter_75);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper826 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 182, __wbg_adapter_66);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper947 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 237, __wbg_adapter_69);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper949 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 237, __wbg_adapter_72);
    return addHeapObject(ret);
};

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbindgen_in = function(arg0, arg1) {
    const ret = getObject(arg0) in getObject(arg1);
    return ret;
};

module.exports.__wbindgen_is_array = function(arg0) {
    const ret = Array.isArray(getObject(arg0));
    return ret;
};

module.exports.__wbindgen_is_bigint = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'bigint';
    return ret;
};

module.exports.__wbindgen_is_falsy = function(arg0) {
    const ret = !getObject(arg0);
    return ret;
};

module.exports.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

module.exports.__wbindgen_is_null = function(arg0) {
    const ret = getObject(arg0) === null;
    return ret;
};

module.exports.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

module.exports.__wbindgen_is_string = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

module.exports.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

module.exports.__wbindgen_jsval_eq = function(arg0, arg1) {
    const ret = getObject(arg0) === getObject(arg1);
    return ret;
};

module.exports.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
    const ret = getObject(arg0) == getObject(arg1);
    return ret;
};

module.exports.__wbindgen_lt = function(arg0, arg1) {
    const ret = getObject(arg0) < getObject(arg1);
    return ret;
};

module.exports.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

module.exports.__wbindgen_neg = function(arg0) {
    const ret = -getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_number_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

module.exports.__wbindgen_number_new = function(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_try_into_number = function(arg0) {
    let result;
    try { result = +getObject(arg0) } catch (e) { result = e }
    const ret = result;
    return addHeapObject(ret);
};

const path = require('path').join(__dirname, 'kaspa_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

