var cl_lang = navigator.language;
var locale;

AjaxHelper.Get('/locale/' + cl_lang, null, function (data) {
    locale = data;
});
if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
    $('#bg').css('background-image', "url('/img/bg.jpg')");
}

//MENU LIB
var menu = (function () {
    menu.prototype.items = new collections.LinkedList();
    function menu() {
        this.menuname = guid();
        this.items = new collections.LinkedList();
    }
    menu.prototype.add = function (item) {
        this.items.add(item);
    };
    menu.prototype.getitems = function () {
        return this.items;
    };
    menu.prototype.removeitem = function (itemname) {
        var cn = 0;
        for (var itm in this.items) {
            if (itm.name == itemname) {
                this.items.remove(itm);
            }
            cn += 1;
        }
    };
    menu.prototype.draw = function (hostname) {
        var fin = "";
        fin += '<div id="' + this.menuname + '" class="cssmenu"><ul>';
        this.items.forEach(function (itm) {
            if (itm.subitems == null) {
                fin += ' <li id="' + itm.name + '"  focus="' + itm.focus + '" class="has-sub" ><a onclick="' + itm.callback + '"><span>' + itm.value + '</span></a></li>';
            }
            else {
                fin += ' <li id="' + itm.name + '" focus="' + itm.focus + '" class="has-sub"><a onclick="' + itm.callback + '"><span>' + itm.value + '</span></a><ul>';
                itm.subitems.forEach(function (subitm) {
                    fin += '<li id="' + subitm.name + '"><a focus="' + subitm.focus + '" onclick="' + subitm.callback + '"><span>' + subitm.value + '</span></a></li>';
                });
                fin += ' </ul></li>';
            }
        });
        fin += '</ul></div>';
        $('#' + hostname).html(fin);
    };
    return menu;
})();
var __extends = this && this.__extends || function (t, e) { function n() { this.constructor = t } for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]); t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n) }, collections; !function (t) { function e(t, e) { return e > t ? -1 : t === e ? 0 : 1 } function n(t, e) { return t === e } function r(e) { return null === e ? "COLLECTION_NULL" : t.isUndefined(e) ? "COLLECTION_UNDEFINED" : t.isString(e) ? "$s" + e : "$o" + e.toString() } function i(e, n) { if (void 0 === n && (n = ","), null === e) return "COLLECTION_NULL"; if (t.isUndefined(e)) return "COLLECTION_UNDEFINED"; if (t.isString(e)) return e.toString(); var r = "{", i = !0; for (var o in e) p(e, o) && (i ? i = !1 : r += n, r = r + o + ":" + e[o]); return r + "}" } function o(t) { return "function" == typeof t } function s(t) { return "undefined" == typeof t } function u(t) { return "[object String]" === Object.prototype.toString.call(t) } function a(e) { return t.isFunction(e) ? function (t, n) { return -1 * e(t, n) } : function (t, e) { return e > t ? 1 : t === e ? 0 : -1 } } function h(t) { return function (e, n) { return 0 === t(e, n) } } var l = Object.prototype.hasOwnProperty, p = function (t, e) { return l.call(t, e) }; t.defaultCompare = e, t.defaultEquals = n, t.defaultToString = r, t.makeString = i, t.isFunction = o, t.isUndefined = s, t.isString = u, t.reverseCompareFunction = a, t.compareToEquals = h; var f; !function (e) { function n(e, n, r) { for (var i = r || t.defaultEquals, o = e.length, s = 0; o > s; s++) if (i(e[s], n)) return s; return -1 } function r(e, n, r) { for (var i = r || t.defaultEquals, o = e.length, s = o - 1; s >= 0; s--) if (i(e[s], n)) return s; return -1 } function i(t, n, r) { return e.indexOf(t, n, r) >= 0 } function o(t, n, r) { var i = e.indexOf(t, n, r); return 0 > i ? !1 : (t.splice(i, 1), !0) } function s(e, n, r) { for (var i = r || t.defaultEquals, o = e.length, s = 0, u = 0; o > u; u++) i(e[u], n) && s++; return s } function u(e, n, r) { var i = r || t.defaultEquals; if (e.length !== n.length) return !1; for (var o = e.length, s = 0; o > s; s++) if (!i(e[s], n[s])) return !1; return !0 } function a(t) { return t.concat() } function h(t, e, n) { if (0 > e || e >= t.length || 0 > n || n >= t.length) return !1; var r = t[e]; return t[e] = t[n], t[n] = r, !0 } function l(t) { return "[" + t.toString() + "]" } function p(t, e) { for (var n = t.length, r = 0; n > r; r++) if (e(t[r]) === !1) return } e.indexOf = n, e.lastIndexOf = r, e.contains = i, e.remove = o, e.frequency = s, e.equals = u, e.copy = a, e.swap = h, e.toString = l, e.forEach = p }(f = t.arrays || (t.arrays = {})); var c = function () { function e() { this.firstNode = null, this.lastNode = null, this.nElements = 0 } return e.prototype.add = function (e, n) { if (t.isUndefined(n) && (n = this.nElements), 0 > n || n > this.nElements || t.isUndefined(e)) return !1; var r = this.createNode(e); if (0 === this.nElements) this.firstNode = r, this.lastNode = r; else if (n === this.nElements) this.lastNode.next = r, this.lastNode = r; else if (0 === n) r.next = this.firstNode, this.firstNode = r; else { var i = this.nodeAtIndex(n - 1); r.next = i.next, i.next = r } return this.nElements++, !0 }, e.prototype.first = function () { return null !== this.firstNode ? this.firstNode.element : void 0 }, e.prototype.last = function () { return null !== this.lastNode ? this.lastNode.element : void 0 }, e.prototype.elementAtIndex = function (t) { var e = this.nodeAtIndex(t); return null === e ? void 0 : e.element }, e.prototype.indexOf = function (e, n) { var r = n || t.defaultEquals; if (t.isUndefined(e)) return -1; for (var i = this.firstNode, o = 0; null !== i;) { if (r(i.element, e)) return o; o++, i = i.next } return -1 }, e.prototype.contains = function (t, e) { return this.indexOf(t, e) >= 0 }, e.prototype.remove = function (e, n) { var r = n || t.defaultEquals; if (this.nElements < 1 || t.isUndefined(e)) return !1; for (var i = null, o = this.firstNode; null !== o;) { if (r(o.element, e)) return o === this.firstNode ? (this.firstNode = this.firstNode.next, o === this.lastNode && (this.lastNode = null)) : o === this.lastNode ? (this.lastNode = i, i.next = o.next, o.next = null) : (i.next = o.next, o.next = null), this.nElements--, !0; i = o, o = o.next } return !1 }, e.prototype.clear = function () { this.firstNode = null, this.lastNode = null, this.nElements = 0 }, e.prototype.equals = function (e, n) { var r = n || t.defaultEquals; return e instanceof t.LinkedList ? this.size() !== e.size() ? !1 : this.equalsAux(this.firstNode, e.firstNode, r) : !1 }, e.prototype.equalsAux = function (t, e, n) { for (; null !== t;) { if (!n(t.element, e.element)) return !1; t = t.next, e = e.next } return !0 }, e.prototype.removeElementAtIndex = function (t) { if (0 > t || t >= this.nElements) return void 0; var e; if (1 === this.nElements) e = this.firstNode.element, this.firstNode = null, this.lastNode = null; else { var n = this.nodeAtIndex(t - 1); null === n ? (e = this.firstNode.element, this.firstNode = this.firstNode.next) : n.next === this.lastNode && (e = this.lastNode.element, this.lastNode = n), null !== n && (e = n.next.element, n.next = n.next.next) } return this.nElements--, e }, e.prototype.forEach = function (t) { for (var e = this.firstNode; null !== e && t(e.element) !== !1;) e = e.next }, e.prototype.reverse = function () { for (var t = null, e = this.firstNode, n = null; null !== e;) n = e.next, e.next = t, t = e, e = n; n = this.firstNode, this.firstNode = this.lastNode, this.lastNode = n }, e.prototype.toArray = function () { for (var t = [], e = this.firstNode; null !== e;) t.push(e.element), e = e.next; return t }, e.prototype.size = function () { return this.nElements }, e.prototype.isEmpty = function () { return this.nElements <= 0 }, e.prototype.toString = function () { return t.arrays.toString(this.toArray()) }, e.prototype.nodeAtIndex = function (t) { if (0 > t || t >= this.nElements) return null; if (t === this.nElements - 1) return this.lastNode; for (var e = this.firstNode, n = 0; t > n; n++) e = e.next; return e }, e.prototype.createNode = function (t) { return { element: t, next: null } }, e }(); t.LinkedList = c; var d = function () { function e(e) { this.table = {}, this.nElements = 0, this.toStr = e || t.defaultToString } return e.prototype.getValue = function (e) { var n = this.table["$" + this.toStr(e)]; return t.isUndefined(n) ? void 0 : n.value }, e.prototype.setValue = function (e, n) { if (t.isUndefined(e) || t.isUndefined(n)) return void 0; var r, i = "$" + this.toStr(e), o = this.table[i]; return t.isUndefined(o) ? (this.nElements++, r = void 0) : r = o.value, this.table[i] = { key: e, value: n }, r }, e.prototype.remove = function (e) { var n = "$" + this.toStr(e), r = this.table[n]; return t.isUndefined(r) ? void 0 : (delete this.table[n], this.nElements--, r.value) }, e.prototype.keys = function () { var t = []; for (var e in this.table) if (p(this.table, e)) { var n = this.table[e]; t.push(n.key) } return t }, e.prototype.values = function () { var t = []; for (var e in this.table) if (p(this.table, e)) { var n = this.table[e]; t.push(n.value) } return t }, e.prototype.forEach = function (t) { for (var e in this.table) if (p(this.table, e)) { var n = this.table[e], r = t(n.key, n.value); if (r === !1) return } }, e.prototype.containsKey = function (e) { return !t.isUndefined(this.getValue(e)) }, e.prototype.clear = function () { this.table = {}, this.nElements = 0 }, e.prototype.size = function () { return this.nElements }, e.prototype.isEmpty = function () { return this.nElements <= 0 }, e.prototype.toString = function () { var t = "{"; return this.forEach(function (e, n) { t = t + "\n	" + e.toString() + " : " + n.toString() }), t + "\n}" }, e }(); t.Dictionary = d; var y = function () { function t(t, e) { this.key = t, this.value = e } return t.prototype.unlink = function () { this.prev.next = this.next, this.next.prev = this.prev }, t }(), v = function (e) { function n(t) { e.call(this, t), this.head = new y(null, null), this.tail = new y(null, null), this.head.next = this.tail, this.tail.prev = this.head } return __extends(n, e), n.prototype.appendToTail = function (t) { var e = this.tail.prev; e.next = t, t.prev = e, t.next = this.tail, this.tail.prev = t }, n.prototype.getLinkedDictionaryPair = function (e) { if (t.isUndefined(e)) return void 0; var n = "$" + this.toStr(e), r = this.table[n]; return r }, n.prototype.getValue = function (e) { var n = this.getLinkedDictionaryPair(e); return t.isUndefined(n) ? void 0 : n.value }, n.prototype.remove = function (n) { var r = this.getLinkedDictionaryPair(n); return t.isUndefined(r) ? void 0 : (e.prototype.remove.call(this, n), r.unlink(), r.value) }, n.prototype.clear = function () { e.prototype.clear.call(this), this.head.next = this.tail, this.tail.prev = this.head }, n.prototype.replace = function (t, e) { var n = "$" + this.toStr(e.key); e.next = t.next, e.prev = t.prev, this.remove(t.key), e.prev.next = e, e.next.prev = e, this.table[n] = e, ++this.nElements }, n.prototype.setValue = function (e, n) { if (t.isUndefined(e) || t.isUndefined(n)) return void 0; var r = this.getLinkedDictionaryPair(e), i = new y(e, n), o = "$" + this.toStr(e); return t.isUndefined(r) ? (this.appendToTail(i), this.table[o] = i, void ++this.nElements) : (this.replace(r, i), r.value) }, n.prototype.keys = function () { var t = []; return this.forEach(function (e) { t.push(e) }), t }, n.prototype.values = function () { var t = []; return this.forEach(function (e, n) { t.push(n) }), t }, n.prototype.forEach = function (t) { for (var e = this.head.next; null != e.next;) { var n = t(e.key, e.value); if (n === !1) return; e = e.next } }, n }(d); t.LinkedDictionary = v; var m = function () { function e(e, n, r) { void 0 === r && (r = !1), this.dict = new d(e), this.equalsF = n || t.defaultEquals, this.allowDuplicate = r } return e.prototype.getValue = function (e) { var n = this.dict.getValue(e); return t.isUndefined(n) ? [] : t.arrays.copy(n) }, e.prototype.setValue = function (e, n) { if (t.isUndefined(e) || t.isUndefined(n)) return !1; if (!this.containsKey(e)) return this.dict.setValue(e, [n]), !0; var r = this.dict.getValue(e); return !this.allowDuplicate && t.arrays.contains(r, n, this.equalsF) ? !1 : (r.push(n), !0) }, e.prototype.remove = function (e, n) { if (t.isUndefined(n)) { var r = this.dict.remove(e); return !t.isUndefined(r) } var i = this.dict.getValue(e); return t.arrays.remove(i, n, this.equalsF) ? (0 === i.length && this.dict.remove(e), !0) : !1 }, e.prototype.keys = function () { return this.dict.keys() }, e.prototype.values = function () { for (var t = this.dict.values(), e = [], n = 0; n < t.length; n++) for (var r = t[n], i = 0; i < r.length; i++) e.push(r[i]); return e }, e.prototype.containsKey = function (t) { return this.dict.containsKey(t) }, e.prototype.clear = function () { this.dict.clear() }, e.prototype.size = function () { return this.dict.size() }, e.prototype.isEmpty = function () { return this.dict.isEmpty() }, e }(); t.MultiDictionary = m; var x = function () { function e(e) { this.data = [], this.compare = e || t.defaultCompare } return e.prototype.leftChildIndex = function (t) { return 2 * t + 1 }, e.prototype.rightChildIndex = function (t) { return 2 * t + 2 }, e.prototype.parentIndex = function (t) { return Math.floor((t - 1) / 2) }, e.prototype.minIndex = function (t, e) { return e >= this.data.length ? t >= this.data.length ? -1 : t : this.compare(this.data[t], this.data[e]) <= 0 ? t : e }, e.prototype.siftUp = function (e) { for (var n = this.parentIndex(e) ; e > 0 && this.compare(this.data[n], this.data[e]) > 0;) t.arrays.swap(this.data, n, e), e = n, n = this.parentIndex(e) }, e.prototype.siftDown = function (e) { for (var n = this.minIndex(this.leftChildIndex(e), this.rightChildIndex(e)) ; n >= 0 && this.compare(this.data[e], this.data[n]) > 0;) t.arrays.swap(this.data, n, e), e = n, n = this.minIndex(this.leftChildIndex(e), this.rightChildIndex(e)) }, e.prototype.peek = function () { return this.data.length > 0 ? this.data[0] : void 0 }, e.prototype.add = function (e) { return t.isUndefined(e) ? void 0 : (this.data.push(e), this.siftUp(this.data.length - 1), !0) }, e.prototype.removeRoot = function () { if (this.data.length > 0) { var t = this.data[0]; return this.data[0] = this.data[this.data.length - 1], this.data.splice(this.data.length - 1, 1), this.data.length > 0 && this.siftDown(0), t } return void 0 }, e.prototype.contains = function (e) { var n = t.compareToEquals(this.compare); return t.arrays.contains(this.data, e, n) }, e.prototype.size = function () { return this.data.length }, e.prototype.isEmpty = function () { return this.data.length <= 0 }, e.prototype.clear = function () { this.data.length = 0 }, e.prototype.forEach = function (e) { t.arrays.forEach(this.data, e) }, e }(); t.Heap = x; var E = function () { function t() { this.list = new c } return t.prototype.push = function (t) { return this.list.add(t, 0) }, t.prototype.add = function (t) { return this.list.add(t, 0) }, t.prototype.pop = function () { return this.list.removeElementAtIndex(0) }, t.prototype.peek = function () { return this.list.first() }, t.prototype.size = function () { return this.list.size() }, t.prototype.contains = function (t, e) { return this.list.contains(t, e) }, t.prototype.isEmpty = function () { return this.list.isEmpty() }, t.prototype.clear = function () { this.list.clear() }, t.prototype.forEach = function (t) { this.list.forEach(t) }, t }(); t.Stack = E; var g = function () { function t() { this.list = new c } return t.prototype.enqueue = function (t) { return this.list.add(t) }, t.prototype.add = function (t) { return this.list.add(t) }, t.prototype.dequeue = function () { if (0 !== this.list.size()) { var t = this.list.first(); return this.list.removeElementAtIndex(0), t } return void 0 }, t.prototype.peek = function () { return 0 !== this.list.size() ? this.list.first() : void 0 }, t.prototype.size = function () { return this.list.size() }, t.prototype.contains = function (t, e) { return this.list.contains(t, e) }, t.prototype.isEmpty = function () { return this.list.size() <= 0 }, t.prototype.clear = function () { this.list.clear() }, t.prototype.forEach = function (t) { this.list.forEach(t) }, t }(); t.Queue = g; var N = function () { function e(e) { this.heap = new x(t.reverseCompareFunction(e)) } return e.prototype.enqueue = function (t) { return this.heap.add(t) }, e.prototype.add = function (t) { return this.heap.add(t) }, e.prototype.dequeue = function () { if (0 !== this.heap.size()) { var t = this.heap.peek(); return this.heap.removeRoot(), t } return void 0 }, e.prototype.peek = function () { return this.heap.peek() }, e.prototype.contains = function (t) { return this.heap.contains(t) }, e.prototype.isEmpty = function () { return this.heap.isEmpty() }, e.prototype.size = function () { return this.heap.size() }, e.prototype.clear = function () { this.heap.clear() }, e.prototype.forEach = function (t) { this.heap.forEach(t) }, e }(); t.PriorityQueue = N; var C = function () { function e(t) { this.dictionary = new d(t) } return e.prototype.contains = function (t) { return this.dictionary.containsKey(t) }, e.prototype.add = function (e) { return this.contains(e) || t.isUndefined(e) ? !1 : (this.dictionary.setValue(e, e), !0) }, e.prototype.intersection = function (t) { var e = this; this.forEach(function (n) { return t.contains(n) || e.remove(n), !0 }) }, e.prototype.union = function (t) { var e = this; t.forEach(function (t) { return e.add(t), !0 }) }, e.prototype.difference = function (t) { var e = this; t.forEach(function (t) { return e.remove(t), !0 }) }, e.prototype.isSubsetOf = function (t) { if (this.size() > t.size()) return !1; var e = !0; return this.forEach(function (n) { return t.contains(n) ? !0 : (e = !1, !1) }), e }, e.prototype.remove = function (t) { return this.contains(t) ? (this.dictionary.remove(t), !0) : !1 }, e.prototype.forEach = function (t) { this.dictionary.forEach(function (e, n) { return t(n) }) }, e.prototype.toArray = function () { return this.dictionary.values() }, e.prototype.isEmpty = function () { return this.dictionary.isEmpty() }, e.prototype.size = function () { return this.dictionary.size() }, e.prototype.clear = function () { this.dictionary.clear() }, e.prototype.toString = function () { return t.arrays.toString(this.toArray()) }, e }(); t.Set = C; var A = function () { function e(e) { this.toStrF = e || t.defaultToString, this.dictionary = new d(this.toStrF), this.nElements = 0 } return e.prototype.add = function (e, n) { if (void 0 === n && (n = 1), t.isUndefined(e) || 0 >= n) return !1; if (this.contains(e)) this.dictionary.getValue(e).copies += n; else { var r = { value: e, copies: n }; this.dictionary.setValue(e, r) } return this.nElements += n, !0 }, e.prototype.count = function (t) { return this.contains(t) ? this.dictionary.getValue(t).copies : 0 }, e.prototype.contains = function (t) { return this.dictionary.containsKey(t) }, e.prototype.remove = function (e, n) { if (void 0 === n && (n = 1), t.isUndefined(e) || 0 >= n) return !1; if (this.contains(e)) { var r = this.dictionary.getValue(e); return this.nElements -= n > r.copies ? r.copies : n, r.copies -= n, r.copies <= 0 && this.dictionary.remove(e), !0 } return !1 }, e.prototype.toArray = function () { for (var t = [], e = this.dictionary.values(), n = e.length, r = 0; n > r; r++) for (var i = e[r], o = i.value, s = i.copies, u = 0; s > u; u++) t.push(o); return t }, e.prototype.toSet = function () { for (var t = new C(this.toStrF), e = this.dictionary.values(), n = e.length, r = 0; n > r; r++) { var i = e[r].value; t.add(i) } return t }, e.prototype.forEach = function (t) { this.dictionary.forEach(function (e, n) { for (var r = n.value, i = n.copies, o = 0; i > o; o++) if (t(r) === !1) return !1; return !0 }) }, e.prototype.size = function () { return this.nElements }, e.prototype.isEmpty = function () { return 0 === this.nElements }, e.prototype.clear = function () { this.nElements = 0, this.dictionary.clear() }, e }(); t.Bag = A; var U = function () { function e(e) { this.root = null, this.compare = e || t.defaultCompare, this.nElements = 0 } return e.prototype.add = function (e) { return t.isUndefined(e) ? !1 : null !== this.insertNode(this.createNode(e)) ? (this.nElements++, !0) : !1 }, e.prototype.clear = function () { this.root = null, this.nElements = 0 }, e.prototype.isEmpty = function () { return 0 === this.nElements }, e.prototype.size = function () { return this.nElements }, e.prototype.contains = function (e) { return t.isUndefined(e) ? !1 : null !== this.searchNode(this.root, e) }, e.prototype.remove = function (t) { var e = this.searchNode(this.root, t); return null === e ? !1 : (this.removeNode(e), this.nElements--, !0) }, e.prototype.inorderTraversal = function (t) { this.inorderTraversalAux(this.root, t, { stop: !1 }) }, e.prototype.preorderTraversal = function (t) { this.preorderTraversalAux(this.root, t, { stop: !1 }) }, e.prototype.postorderTraversal = function (t) { this.postorderTraversalAux(this.root, t, { stop: !1 }) }, e.prototype.levelTraversal = function (t) { this.levelTraversalAux(this.root, t) }, e.prototype.minimum = function () { return this.isEmpty() ? void 0 : this.minimumAux(this.root).element }, e.prototype.maximum = function () { return this.isEmpty() ? void 0 : this.maximumAux(this.root).element }, e.prototype.forEach = function (t) { this.inorderTraversal(t) }, e.prototype.toArray = function () { var t = []; return this.inorderTraversal(function (e) { return t.push(e), !0 }), t }, e.prototype.height = function () { return this.heightAux(this.root) }, e.prototype.searchNode = function (t, e) { for (var n = null; null !== t && 0 !== n;) n = this.compare(e, t.element), 0 > n ? t = t.leftCh : n > 0 && (t = t.rightCh); return t }, e.prototype.transplant = function (t, e) { null === t.parent ? this.root = e : t === t.parent.leftCh ? t.parent.leftCh = e : t.parent.rightCh = e, null !== e && (e.parent = t.parent) }, e.prototype.removeNode = function (t) { if (null === t.leftCh) this.transplant(t, t.rightCh); else if (null === t.rightCh) this.transplant(t, t.leftCh); else { var e = this.minimumAux(t.rightCh); e.parent !== t && (this.transplant(e, e.rightCh), e.rightCh = t.rightCh, e.rightCh.parent = e), this.transplant(t, e), e.leftCh = t.leftCh, e.leftCh.parent = e } }, e.prototype.inorderTraversalAux = function (t, e, n) { null === t || n.stop || (this.inorderTraversalAux(t.leftCh, e, n), n.stop || (n.stop = e(t.element) === !1, n.stop || this.inorderTraversalAux(t.rightCh, e, n))) }, e.prototype.levelTraversalAux = function (t, e) { var n = new g; for (null !== t && n.enqueue(t) ; !n.isEmpty() ;) { if (t = n.dequeue(), e(t.element) === !1) return; null !== t.leftCh && n.enqueue(t.leftCh), null !== t.rightCh && n.enqueue(t.rightCh) } }, e.prototype.preorderTraversalAux = function (t, e, n) { null === t || n.stop || (n.stop = e(t.element) === !1, n.stop || (this.preorderTraversalAux(t.leftCh, e, n), n.stop || this.preorderTraversalAux(t.rightCh, e, n))) }, e.prototype.postorderTraversalAux = function (t, e, n) { null === t || n.stop || (this.postorderTraversalAux(t.leftCh, e, n), n.stop || (this.postorderTraversalAux(t.rightCh, e, n), n.stop || (n.stop = e(t.element) === !1))) }, e.prototype.minimumAux = function (t) { for (; null !== t.leftCh;) t = t.leftCh; return t }, e.prototype.maximumAux = function (t) { for (; null !== t.rightCh;) t = t.rightCh; return t }, e.prototype.heightAux = function (t) { return null === t ? -1 : Math.max(this.heightAux(t.leftCh), this.heightAux(t.rightCh)) + 1 }, e.prototype.insertNode = function (t) { for (var e = null, n = this.root, r = null; null !== n;) { if (r = this.compare(t.element, n.element), 0 === r) return null; 0 > r ? (e = n, n = n.leftCh) : (e = n, n = n.rightCh) } return t.parent = e, null === e ? this.root = t : this.compare(t.element, e.element) < 0 ? e.leftCh = t : e.rightCh = t, t }, e.prototype.createNode = function (t) { return { element: t, leftCh: null, rightCh: null, parent: null } }, e }(); t.BSTree = U }(collections || (collections = {}));

var menu_item = (function () {
    menu_item.prototype.subitems = null;
    function menu_item(value, cb) {
        this.name = guid();
        this.value = value;
        this.callback = cb;
        this.focus = false;
    }
    function menu_item(value, cb, focused) {
        this.name = guid();
        this.value = value;
        this.callback = cb;
        this.focus = focused;
    }
    menu_item.prototype.SetFocus = function (flag) {
        this.focus = true;
    };
    menu_item.prototype.add = function (item) {

        if (this.subitems == null) {
            this.subitems = new collections.LinkedList(); 
        }
        this.subitems.add(item);
    };
    menu_item.prototype.getitems = function () {
        
        return this.subitems.toArray();
    };
    menu_item.prototype.removeitem = function (itemname) {
        var cn = 0;
        for (var itm in this.subitems) {
            if (itm.name == itemname) {
                this.subitems.remove(itm);
            }
            cn += 1;
        }
    };

    return menu_item;
})();

function initMainLib() {
    //LoadLogos
    $(".logo").each(function () {
        $(this).attr("style", $(this).attr("style") + "background-image:url('" + $(this).attr("image") + "'); ");
    });
    $('url').on('click', function () {
        location.href = $(this).attr('href');
    });
    //ButtonTextLocalScript
    $("input").each(function () {
        var type = $(this).attr('type');
        var txt = $(this).attr('Text')
        if (typeof type !== "undefined" && typeof txt !== "undefined") {
            if (type == 'button') {
                $(this).val(locale[txt]);
            }
        }
    });
    $("t").each(function () {
        var txt = $(this).attr('Text')
        if (txt !== "undefined") {
            $(this).html(locale[txt]);
        }
    });
    //Enable responsive menus
    var menus = $('.cssmenu');
    var menuList = menus.find('ul:first');
    var listItems = menus.find('li').not('#responsive-tab');
    menuList.prepend('<li id="responsive-tab"><a href="#">Menu</a></li>');
    menus.on('click', '#responsive-tab', function () {
        listItems.slideToggle('fast');
        listItems.addClass('collapsed');
    });
}
 

var SpinnerInit = "<script>var opts = {  lines: 9 , length: 0 , width: 8, radius: 10 , scale: 0.5 , corners: 1 , color: '#fff', opacity: 0 , rotate: 0 , direction: -1 , speed:1 , trail: 70 , fps: 20 , zIndex: 2e9 , className: 'spinner' , top: '4%', left: '4%' , shadow: false , hwaccel: false, position: 'relative'};";
SpinnerInit += 'var target = document.getElementById("spinnerhostlogin");';
SpinnerInit += 'var spinner = new Spinner(opts).spin(target);<' + "/" + 'script><div id="spinnerhostlogin"></div>';

var sidebaranimationover = true;
function HideSideBar(sidebar) {
    if (sidebaranimationover) {
        sidebaranimationover = false;
        $('#' + sidebar).animate({ width: 0 }, 700, "easeOutQuint", function () {
            $('#' + sidebar).css('display', 'none');
            sidebaranimationover = true;
        });
    }
}

var SideBar = (function () {

    function SideBar(title) {
        var sidebarname = guid();
        var fin = '<div id="' + sidebarname + '"autohide="true" class="sidebar" style="display:none; width:0;">';
        fin += '<div id="' + sidebarname + '_cont" class="sidebar_content" style="opacity:1;">';
        fin += '<div class="sidebar_title">';
        fin += title;
        fin += '</div>';
        fin += '</div>';
        fin += '</div>';
        fin += '<script>';
        fin += 'var mouseover' + sidebarname + ' = false; ';
        fin += '$("#' + sidebarname + '").mouseover(function () { mouseover' + sidebarname + ' = true; });';
        fin += '$("#' + sidebarname + '").mouseleave(function () { mouseover' + sidebarname + ' = false; });';
        fin += '$("body").on("click",function(){if (!mouseover' + sidebarname + ' && $("#' + sidebarname + '").attr("autohide")=="true") {  HideSideBar("' + sidebarname + '");}  });';
        fin += '<' + '/' + 'script>';

        $('html').append(fin);
        this.mysidebarname = sidebarname;

    }
    SideBar.prototype.Show = function () {
        if (sidebaranimationover) {
            sidebaranimationover = false;
            $('#' + this.mysidebarname).css('display', 'block');
            $('#' + this.mysidebarname).animate({ width: 300 }, 700, "easeOutBounce", function () {

                sidebaranimationover = true;
            });
        }
    };
    SideBar.prototype.Hide = function () {
        if (sidebaranimationover) {
            sidebaranimationover = false;

            $('#' + this.mysidebarname).animate({ width: 0 }, 700, "easeOutQuint", function () {
                $('#' + this.mysidebarname).css('display', 'none');
                sidebaranimationover = true;
            });
        }
    };
    SideBar.prototype.AddItem = function (item) {
        var fin = '<div id="' + this.mysidebarname + '_' + item.GetName() + '" isitem="true" class="sidebar_mbtn">';
        fin += '<div class="sidebar_item">';
        fin += '<table><tr>';
        fin += '<td  onclick="' + item.GetCallback() + '" id="' + this.mysidebarname + '_' + item.GetName() + '_title" class="sidebar_item_title">' + item.GetTitle() + '</td>';

        if (item.GetDeleteBtn()) {
            var nm = "#" + this.mysidebarname + '_' + item.GetName();
            fin += '<td class="sidebar_item_clbtn" onclick="$(' + "'" + nm + "'" + ').remove();" > </td>';
        }
        else {
            var nm = "#" + this.mysidebarname + '_' + item.GetName();
            fin += '<td class="sidebar_item_clbtn" style="visibility:hidden;" onclick="$(' + "'" + nm + "'" + ').remove();" > </td>';
        }
        fin += '</tr><tr><td  onclick="' + item.GetCallback() + '" id="' + this.mysidebarname + '_' + item.GetName() + '_des" class="sidebar_item_des">' + item.GetDescription() + '</td>';
        fin += '</tr></table></div></div>';
        $('#' + this.mysidebarname + '_cont').append(fin);
    };
    SideBar.prototype.DeleteItem = function (item) {
        $("#" + this.mysidebarname + '_' + item.GetName()).remove();
    };
    SideBar.prototype.ClearItems = function () {
        $('#' + this.mysidebarname + '_cont').children('div').each(function () {
            if ($(this).attr('isitem') == 'true') {
                $(this).remove();
            }
        });
    };
    SideBar.prototype.SetAutoHide = function (flag) {
        $('#' + this.mysidebarname).attr('autohide', flag);
    };
    SideBar.prototype.Delete = function () {
        $('#' + this.mysidebarname).remove();
    };
    return SideBar;
})();

var SideBarItem = (function () {
    function SideBarItem(Title, Description, callback, Showdeletebtn) {
        this.my_title = Title;
        this.my_description = Description;
        this.my_name = guid();
        this.my_callback = callback;
        this.my_showbtn = Showdeletebtn;
    }
    SideBarItem.prototype.GetTitle = function () {
        return this.my_title;
    };
    SideBarItem.prototype.GetDescription = function () {
        return this.my_description;
    };
    SideBarItem.prototype.GetName = function () {
        return this.my_name;
    };
    SideBarItem.prototype.GetCallback = function () {
        return this.my_callback;
    };
    SideBarItem.prototype.GetDeleteBtn = function () {
        return this.my_showbtn;
    };

    return SideBarItem;
})();
