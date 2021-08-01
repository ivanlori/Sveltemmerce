
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.4' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* node_modules/fa-svelte/src/Icon.svelte generated by Svelte v3.29.4 */

    const file = "node_modules/fa-svelte/src/Icon.svelte";

    function create_fragment(ctx) {
    	let svg;
    	let path_1;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path_1 = svg_element("path");
    			attr_dev(path_1, "fill", "currentColor");
    			attr_dev(path_1, "d", /*path*/ ctx[0]);
    			add_location(path_1, file, 7, 2, 129);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", svg_class_value = "" + (null_to_empty(/*classes*/ ctx[1]) + " svelte-go33dg"));
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[2]);
    			add_location(svg, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*path*/ 1) {
    				attr_dev(path_1, "d", /*path*/ ctx[0]);
    			}

    			if (dirty & /*classes*/ 2 && svg_class_value !== (svg_class_value = "" + (null_to_empty(/*classes*/ ctx[1]) + " svelte-go33dg"))) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (dirty & /*viewBox*/ 4) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Icon", slots, []);
    	let { icon } = $$props;
    	let path = [];
    	let classes = "";
    	let viewBox = "";

    	$$self.$$set = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("icon" in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    	};

    	$$self.$capture_state = () => ({ icon, path, classes, viewBox });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
    		if ("icon" in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ("path" in $$props) $$invalidate(0, path = $$new_props.path);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("viewBox" in $$props) $$invalidate(2, viewBox = $$new_props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*icon*/ 8) {
    			 $$invalidate(2, viewBox = "0 0 " + icon.icon[0] + " " + icon.icon[1]);
    		}

    		 $$invalidate(1, classes = "fa-svelte " + ($$props.class ? $$props.class : ""));

    		if ($$self.$$.dirty & /*icon*/ 8) {
    			 $$invalidate(0, path = icon.icon[4]);
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [path, classes, viewBox, icon];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { icon: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[3] === undefined && !("icon" in props)) {
    			console.warn("<Icon> was created without expected prop 'icon'");
    		}
    	}

    	get icon() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*!
     * Font Awesome Free 5.15.1 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     */
    var faBars = {
      prefix: 'fas',
      iconName: 'bars',
      icon: [448, 512, [], "f0c9", "M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"]
    };
    var faLongArrowAltRight = {
      prefix: 'fas',
      iconName: 'long-arrow-alt-right',
      icon: [448, 512, [], "f30b", "M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z"]
    };
    var faMinus = {
      prefix: 'fas',
      iconName: 'minus',
      icon: [448, 512, [], "f068", "M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"]
    };
    var faPlus = {
      prefix: 'fas',
      iconName: 'plus',
      icon: [448, 512, [], "f067", "M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"]
    };
    var faShoppingCart = {
      prefix: 'fas',
      iconName: 'shopping-cart',
      icon: [576, 512, [], "f07a", "M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"]
    };
    var faTimes = {
      prefix: 'fas',
      iconName: 'times',
      icon: [352, 512, [], "f00d", "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"]
    };

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const productsInCart = writable(0);
    const cartContents = writable([]);
    const checkoutOpened = writable(false);

    const totalPrice = derived(
      productsInCart,
      ($productsInCart) => $productsInCart * $cartContents.price
    );

    /* src/components/Logo.svelte generated by Svelte v3.29.4 */

    const file$1 = "src/components/Logo.svelte";

    function create_fragment$1(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let text_1;
    	let t;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			text_1 = svg_element("text");
    			t = text("veltemmerce");
    			attr_dev(path0, "fill", "#EF4523");
    			attr_dev(path0, "d", "M177.894,104.374c-12.585-18.142-37.672-23.461-55.711-12.018l-31.777,20.339\n\tc-8.671,5.436-14.679,14.327-16.409,24.387c-1.502,8.437-0.232,17.115,3.812,24.615c-2.773,4.167-4.627,8.792-5.43,13.637\n\tc-1.854,10.283,0.573,20.938,6.583,29.376c12.714,18.126,37.674,23.439,55.708,11.993l31.781-20.196\n\tc8.671-5.441,14.685-14.339,16.415-24.417c1.511-8.438,0.231-17.111-3.803-24.6c2.774-4.158,4.612-8.789,5.431-13.65\n\tC186.447,123.45,184.024,112.81,177.894,104.374");
    			add_location(path0, file$1, 15, 2, 305);
    			attr_dev(path1, "fill", "#FFFFFF");
    			attr_dev(path1, "d", "M119.077,206.429c-10.292,2.656-21.037-1.373-27.05-10.04c-3.703-5.114-5.091-11.445-4.043-17.695\n\tc0.231-1.057,0.452-1.953,0.685-3.01l0.585-1.834l1.621,1.131c3.809,2.775,7.969,4.872,12.48,6.25l1.153,0.354l-0.117,1.151\n\tc-0.117,1.62,0.352,3.339,1.27,4.745c1.855,2.656,5.091,3.908,8.203,3.125c0.703-0.234,1.388-0.469,1.974-0.818l31.669-20.235\n\tc1.604-1.016,2.656-2.54,3.006-4.375c0.352-1.876-0.115-3.829-1.17-5.313c-1.836-2.656-5.078-3.828-8.203-3.01\n\tc-0.693,0.234-1.367,0.469-1.953,0.781l-12.139,7.776c-1.972,1.25-4.16,2.188-6.472,2.772c-10.286,2.656-21.037-1.406-27.044-10.08\n\tc-3.593-5.078-5.095-11.434-3.929-17.662c1.038-6.016,4.729-11.445,9.936-14.688l31.798-20.221c1.951-1.273,4.139-2.199,6.45-2.889\n\tc10.306-2.659,21.046,1.388,27.06,10.051c3.686,5.091,5.078,11.438,4.03,17.686c-0.228,1.037-0.46,1.953-0.793,3.007l-0.581,1.836\n\tl-1.629-1.15c-3.801-2.773-7.979-4.844-12.471-6.231l-1.17-0.352l0.115-1.151c0.117-1.623-0.349-3.358-1.253-4.746\n\tc-1.87-2.656-5.101-3.808-8.208-3.005c-0.693,0.231-1.396,0.466-1.982,0.816l-31.651,20.216c-1.621,1.041-2.668,2.539-3.008,4.392\n\tc-0.351,1.857,0.117,3.812,1.153,5.312c1.855,2.654,5.079,3.819,8.204,3.003c0.701-0.234,1.386-0.453,1.972-0.787l12.122-7.762\n\tc1.981-1.267,4.18-2.188,6.482-2.891c10.273-2.656,21.026,1.389,27.033,10.069c3.708,5.078,5.097,11.443,4.057,17.684\n\tc-1.052,5.99-4.732,11.424-9.947,14.662l-31.777,20.235C123.568,204.827,121.38,205.726,119.077,206.429");
    			add_location(path1, file$1, 22, 2, 797);
    			attr_dev(text_1, "transform", "matrix(0.8782 0 0 1 193.7095 194.8682)");
    			attr_dev(text_1, "fill", "#58595B");
    			attr_dev(text_1, "font-family", "'CambriaMath'");
    			attr_dev(text_1, "font-size", "117.9507");
    			add_location(text_1, file$1, 36, 2, 2245);
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "x", "0px");
    			attr_dev(svg, "y", "0px");
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", "0 0 780 400");
    			attr_dev(svg, "enable-background", "new 0 0 841.89 312.162");
    			attr_dev(svg, "xml:space", "preserve");
    			add_location(svg, file$1, 4, 0, 66);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Logo", slots, []);
    	let { width } = $$props;
    	let { height } = $$props;
    	const writable_props = ["width", "height"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    	};

    	$$self.$capture_state = () => ({ width, height });

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { width: 0, height: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[0] === undefined && !("width" in props)) {
    			console.warn("<Logo> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !("height" in props)) {
    			console.warn("<Logo> was created without expected prop 'height'");
    		}
    	}

    	get width() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.29.4 */
    const file$2 = "src/components/Header.svelte";

    // (30:12) {#if $productsInCart}
    function create_if_block(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*$productsInCart*/ ctx[1]);
    			attr_dev(span, "class", "bg-blue-400 text-white p-2");
    			add_location(span, file$2, 30, 14, 1189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$productsInCart*/ 2) set_data_dev(t, /*$productsInCart*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(30:12) {#if $productsInCart}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let header;
    	let div4;
    	let div3;
    	let div0;
    	let logo;
    	let t0;
    	let nav;
    	let div1;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let a3;
    	let t8;
    	let a4;
    	let t10;
    	let button0;
    	let icon0;
    	let t11;
    	let nav_class_value;
    	let t12;
    	let div2;
    	let button1;
    	let icon1;
    	let current;
    	let mounted;
    	let dispose;

    	logo = new Logo({
    			props: { width: "300px", height: "120px" },
    			$$inline: true
    		});

    	icon0 = new Icon({
    			props: { icon: faShoppingCart },
    			$$inline: true
    		});

    	let if_block = /*$productsInCart*/ ctx[1] && create_if_block(ctx);
    	icon1 = new Icon({ props: { icon: faBars }, $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			nav = element("nav");
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "Shop";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "Categories";
    			t6 = space();
    			a3 = element("a");
    			a3.textContent = "Contact";
    			t8 = space();
    			a4 = element("a");
    			a4.textContent = "About";
    			t10 = space();
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t11 = space();
    			if (if_block) if_block.c();
    			t12 = space();
    			div2 = element("div");
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			attr_dev(div0, "class", "w-1/2 flex items-center");
    			add_location(div0, file$2, 10, 6, 356);
    			attr_dev(a0, "class", "menu sm:mx-3 sm:mt-0 svelte-sx48hy");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$2, 19, 10, 647);
    			attr_dev(a1, "class", "menu sm:mx-3 sm:mt-0 svelte-sx48hy");
    			attr_dev(a1, "href", "/");
    			add_location(a1, file$2, 20, 10, 707);
    			attr_dev(a2, "class", "menu sm:mx-3 sm:mt-0 svelte-sx48hy");
    			attr_dev(a2, "href", "/");
    			add_location(a2, file$2, 21, 10, 767);
    			attr_dev(a3, "class", "menu sm:mx-3 sm:mt-0 svelte-sx48hy");
    			attr_dev(a3, "href", "/");
    			add_location(a3, file$2, 22, 10, 833);
    			attr_dev(a4, "class", "menu sm:mx-3 sm:mt-0 svelte-sx48hy");
    			attr_dev(a4, "href", "/");
    			add_location(a4, file$2, 23, 10, 896);
    			attr_dev(button0, "class", "mt-3 text-gray-600 focus:outline-none");
    			add_location(button0, file$2, 24, 10, 957);
    			attr_dev(div1, "class", "flex flex-col sm:flex-row");
    			add_location(div1, file$2, 18, 8, 597);
    			attr_dev(nav, "class", nav_class_value = "w-1/2 " + (/*isMenuMobileOpen*/ ctx[0] ? "sm:flex" : "hidden") + " sm:flex items-center justify-end");
    			add_location(nav, file$2, 13, 6, 459);
    			add_location(button1, file$2, 36, 8, 1364);
    			attr_dev(div2, "class", "flex sm:hidden");
    			add_location(div2, file$2, 35, 6, 1327);
    			attr_dev(div3, "class", "flex justify-between");
    			add_location(div3, file$2, 9, 4, 315);
    			attr_dev(div4, "class", "container mx-auto px-6 py-3");
    			add_location(div4, file$2, 8, 2, 269);
    			add_location(header, file$2, 7, 0, 258);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			mount_component(logo, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, nav);
    			append_dev(nav, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t2);
    			append_dev(div1, a1);
    			append_dev(div1, t4);
    			append_dev(div1, a2);
    			append_dev(div1, t6);
    			append_dev(div1, a3);
    			append_dev(div1, t8);
    			append_dev(div1, a4);
    			append_dev(div1, t10);
    			append_dev(div1, button0);
    			mount_component(icon0, button0, null);
    			append_dev(button0, t11);
    			if (if_block) if_block.m(button0, null);
    			append_dev(div3, t12);
    			append_dev(div3, div2);
    			append_dev(div2, button1);
    			mount_component(icon1, button1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$productsInCart*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(button0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*isMenuMobileOpen*/ 1 && nav_class_value !== (nav_class_value = "w-1/2 " + (/*isMenuMobileOpen*/ ctx[0] ? "sm:flex" : "hidden") + " sm:flex items-center justify-end")) {
    				attr_dev(nav, "class", nav_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(logo);
    			destroy_component(icon0);
    			if (if_block) if_block.d();
    			destroy_component(icon1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $productsInCart;
    	validate_store(productsInCart, "productsInCart");
    	component_subscribe($$self, productsInCart, $$value => $$invalidate(1, $productsInCart = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	let isMenuMobileOpen = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => checkoutOpened.update(() => true);
    	const click_handler_1 = () => $$invalidate(0, isMenuMobileOpen = !isMenuMobileOpen);

    	$$self.$capture_state = () => ({
    		Icon,
    		faShoppingCart,
    		faBars,
    		productsInCart,
    		checkoutOpened,
    		Logo,
    		isMenuMobileOpen,
    		$productsInCart
    	});

    	$$self.$inject_state = $$props => {
    		if ("isMenuMobileOpen" in $$props) $$invalidate(0, isMenuMobileOpen = $$props.isMenuMobileOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isMenuMobileOpen, $productsInCart, click_handler, click_handler_1];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/ProductCart.svelte generated by Svelte v3.29.4 */
    const file$3 = "src/components/ProductCart.svelte";

    function create_fragment$3(ctx) {
    	let div4;
    	let img_1;
    	let img_1_src_value;
    	let t0;
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let t2;
    	let button0;
    	let icon0;
    	let t3;
    	let div1;
    	let button1;
    	let icon1;
    	let t4;
    	let span0;
    	let t5;
    	let t6;
    	let button2;
    	let icon2;
    	let t7;
    	let div2;
    	let span1;
    	let t8_value = (/*price*/ ctx[3] * /*value*/ ctx[4]).toFixed(2) + "";
    	let t8;
    	let t9;
    	let div4_id_value;
    	let current;
    	let mounted;
    	let dispose;
    	icon0 = new Icon({ props: { icon: faMinus }, $$inline: true });
    	icon1 = new Icon({ props: { icon: faPlus }, $$inline: true });
    	icon2 = new Icon({ props: { icon: faMinus }, $$inline: true });

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			img_1 = element("img");
    			t0 = space();
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			t1 = text(/*name*/ ctx[2]);
    			t2 = space();
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			t4 = space();
    			span0 = element("span");
    			t5 = text(/*value*/ ctx[4]);
    			t6 = space();
    			button2 = element("button");
    			create_component(icon2.$$.fragment);
    			t7 = space();
    			div2 = element("div");
    			span1 = element("span");
    			t8 = text(t8_value);
    			t9 = text("€");
    			attr_dev(img_1, "class", "h-20 w-20 object-cover rounded");
    			if (img_1.src !== (img_1_src_value = /*img*/ ctx[1])) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", "");
    			add_location(img_1, file$3, 18, 2, 548);
    			attr_dev(h3, "class", "text-sm text-gray-600");
    			add_location(h3, file$3, 21, 6, 698);
    			add_location(button0, file$3, 22, 6, 750);
    			attr_dev(div0, "class", "flex justify-between items-center");
    			add_location(div0, file$3, 20, 4, 644);
    			attr_dev(button1, "class", "text-gray-500 focus:outline-none focus:text-gray-600");
    			add_location(button1, file$3, 27, 6, 901);
    			attr_dev(span0, "class", "text-gray-700 mx-2");
    			add_location(span0, file$3, 33, 6, 1072);
    			attr_dev(button2, "class", "text-gray-500 focus:outline-none focus:text-gray-600");
    			add_location(button2, file$3, 34, 6, 1126);
    			attr_dev(div1, "class", "flex items-center mt-2");
    			add_location(div1, file$3, 26, 4, 858);
    			attr_dev(span1, "class", "text-gray-600");
    			add_location(span1, file$3, 42, 6, 1334);
    			attr_dev(div2, "class", "text-right");
    			add_location(div2, file$3, 41, 4, 1303);
    			attr_dev(div3, "class", "mx-3 w-full");
    			add_location(div3, file$3, 19, 2, 614);
    			attr_dev(div4, "id", div4_id_value = String(/*id*/ ctx[0]));
    			attr_dev(div4, "class", "flex justify-between mt-6");
    			add_location(div4, file$3, 17, 0, 490);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, img_1);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(div0, t2);
    			append_dev(div0, button0);
    			mount_component(icon0, button0, null);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div1, button1);
    			mount_component(icon1, button1, null);
    			append_dev(div1, t4);
    			append_dev(div1, span0);
    			append_dev(span0, t5);
    			append_dev(div1, t6);
    			append_dev(div1, button2);
    			mount_component(icon2, button2, null);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, span1);
    			append_dev(span1, t8);
    			append_dev(span1, t9);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[8], false, false, false),
    					listen_dev(button2, "click", /*decrement*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*img*/ 2 && img_1.src !== (img_1_src_value = /*img*/ ctx[1])) {
    				attr_dev(img_1, "src", img_1_src_value);
    			}

    			if (!current || dirty & /*name*/ 4) set_data_dev(t1, /*name*/ ctx[2]);
    			if (!current || dirty & /*value*/ 16) set_data_dev(t5, /*value*/ ctx[4]);
    			if ((!current || dirty & /*price, value*/ 24) && t8_value !== (t8_value = (/*price*/ ctx[3] * /*value*/ ctx[4]).toFixed(2) + "")) set_data_dev(t8, t8_value);

    			if (!current || dirty & /*id*/ 1 && div4_id_value !== (div4_id_value = String(/*id*/ ctx[0]))) {
    				attr_dev(div4, "id", div4_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			destroy_component(icon2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ProductCart", slots, []);
    	let { id } = $$props;
    	let { img } = $$props;
    	let { name } = $$props;
    	let { price } = $$props;
    	let value = 1;

    	function decrement() {
    		return value > 1 ? $$invalidate(4, value--, value) : value;
    	}

    	function removeFromCart(id) {
    		productsInCart.update(items => items - 1);
    		cartContents.update(contents => contents.filter(el => el.id !== id));
    	}

    	const writable_props = ["id", "img", "name", "price"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProductCart> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => removeFromCart(id);
    	const click_handler_1 = () => $$invalidate(4, value++, value);

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("img" in $$props) $$invalidate(1, img = $$props.img);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("price" in $$props) $$invalidate(3, price = $$props.price);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		faPlus,
    		faMinus,
    		cartContents,
    		productsInCart,
    		id,
    		img,
    		name,
    		price,
    		value,
    		decrement,
    		removeFromCart
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("img" in $$props) $$invalidate(1, img = $$props.img);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("price" in $$props) $$invalidate(3, price = $$props.price);
    		if ("value" in $$props) $$invalidate(4, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		id,
    		img,
    		name,
    		price,
    		value,
    		decrement,
    		removeFromCart,
    		click_handler,
    		click_handler_1
    	];
    }

    class ProductCart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { id: 0, img: 1, name: 2, price: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductCart",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !("id" in props)) {
    			console.warn("<ProductCart> was created without expected prop 'id'");
    		}

    		if (/*img*/ ctx[1] === undefined && !("img" in props)) {
    			console.warn("<ProductCart> was created without expected prop 'img'");
    		}

    		if (/*name*/ ctx[2] === undefined && !("name" in props)) {
    			console.warn("<ProductCart> was created without expected prop 'name'");
    		}

    		if (/*price*/ ctx[3] === undefined && !("price" in props)) {
    			console.warn("<ProductCart> was created without expected prop 'price'");
    		}
    	}

    	get id() {
    		throw new Error("<ProductCart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ProductCart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get img() {
    		throw new Error("<ProductCart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<ProductCart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<ProductCart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ProductCart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get price() {
    		throw new Error("<ProductCart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set price(value) {
    		throw new Error("<ProductCart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/PromoCode.svelte generated by Svelte v3.29.4 */

    const file$4 = "src/components/PromoCode.svelte";

    function create_fragment$4(ctx) {
    	let form;
    	let input;
    	let t0;
    	let button;
    	let span;

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			span = element("span");
    			span.textContent = "Apply";
    			attr_dev(input, "class", "form-input w-48");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Add promocode");
    			add_location(input, file$4, 1, 2, 50);
    			add_location(span, file$4, 4, 4, 300);
    			attr_dev(button, "class", "ml-3 flex items-center px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500");
    			add_location(button, file$4, 2, 2, 126);
    			attr_dev(form, "class", "flex items-center justify-center");
    			add_location(form, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			append_dev(form, t0);
    			append_dev(form, button);
    			append_dev(button, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PromoCode", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PromoCode> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class PromoCode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PromoCode",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/Checkout.svelte generated by Svelte v3.29.4 */
    const file$5 = "src/components/Checkout.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (22:2) {:else}
    function create_else_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$cartContents*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$cartContents*/ 2) {
    				each_value = /*$cartContents*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(22:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#if $productsInCart === 0}
    function create_if_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Your cart is empty");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(20:2) {#if $productsInCart === 0}",
    		ctx
    	});

    	return block;
    }

    // (23:4) {#each $cartContents as content}
    function create_each_block(ctx) {
    	let itemcart;
    	let current;

    	itemcart = new ProductCart({
    			props: {
    				id: /*content*/ ctx[3].id,
    				name: /*content*/ ctx[3].title,
    				img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80",
    				price: /*content*/ ctx[3].price
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(itemcart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemcart, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const itemcart_changes = {};
    			if (dirty & /*$cartContents*/ 2) itemcart_changes.id = /*content*/ ctx[3].id;
    			if (dirty & /*$cartContents*/ 2) itemcart_changes.name = /*content*/ ctx[3].title;
    			if (dirty & /*$cartContents*/ 2) itemcart_changes.price = /*content*/ ctx[3].price;
    			itemcart.$set(itemcart_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemcart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemcart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemcart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(23:4) {#each $cartContents as content}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let button;
    	let icon0;
    	let t2;
    	let hr;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let t4;
    	let div1;
    	let promocode;
    	let t5;
    	let div2;
    	let span;
    	let t7;
    	let icon1;
    	let current;
    	let mounted;
    	let dispose;
    	icon0 = new Icon({ props: { icon: faTimes }, $$inline: true });
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$productsInCart*/ ctx[0] === 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	promocode = new PromoCode({ $$inline: true });

    	icon1 = new Icon({
    			props: { icon: faLongArrowAltRight },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Your cart";
    			t1 = space();
    			button = element("button");
    			create_component(icon0.$$.fragment);
    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			if_block.c();
    			t4 = space();
    			div1 = element("div");
    			create_component(promocode.$$.fragment);
    			t5 = space();
    			div2 = element("div");
    			span = element("span");
    			span.textContent = "Checkout";
    			t7 = space();
    			create_component(icon1.$$.fragment);
    			attr_dev(h3, "class", "text-2xl font-medium text-gray-700");
    			add_location(h3, file$5, 10, 4, 413);
    			attr_dev(button, "class", "text-gray-600 focus:outline-none");
    			add_location(button, file$5, 11, 4, 479);
    			attr_dev(div0, "class", "flex items-center justify-between");
    			add_location(div0, file$5, 9, 2, 361);
    			attr_dev(hr, "class", "my-3");
    			add_location(hr, file$5, 18, 2, 653);
    			attr_dev(div1, "class", "mt-8");
    			add_location(div1, file$5, 32, 2, 1053);
    			add_location(span, file$5, 38, 4, 1290);
    			attr_dev(div2, "class", "flex items-center justify-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500");
    			add_location(div2, file$5, 35, 2, 1101);
    			attr_dev(div3, "class", "sidebar fixed svelte-es13fz");
    			add_location(div3, file$5, 8, 0, 331);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(div0, t1);
    			append_dev(div0, button);
    			mount_component(icon0, button, null);
    			append_dev(div3, t2);
    			append_dev(div3, hr);
    			append_dev(div3, t3);
    			if_blocks[current_block_type_index].m(div3, null);
    			append_dev(div3, t4);
    			append_dev(div3, div1);
    			mount_component(promocode, div1, null);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, span);
    			append_dev(div2, t7);
    			mount_component(icon1, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div3, t4);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(promocode.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(promocode.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(icon0);
    			if_blocks[current_block_type_index].d();
    			destroy_component(promocode);
    			destroy_component(icon1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $productsInCart;
    	let $cartContents;
    	validate_store(productsInCart, "productsInCart");
    	component_subscribe($$self, productsInCart, $$value => $$invalidate(0, $productsInCart = $$value));
    	validate_store(cartContents, "cartContents");
    	component_subscribe($$self, cartContents, $$value => $$invalidate(1, $cartContents = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Checkout", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Checkout> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => checkoutOpened.update(() => false);

    	$$self.$capture_state = () => ({
    		ItemCart: ProductCart,
    		PromoCode,
    		cartContents,
    		productsInCart,
    		Icon,
    		faLongArrowAltRight,
    		faTimes,
    		checkoutOpened,
    		$productsInCart,
    		$cartContents
    	});

    	return [$productsInCart, $cartContents, click_handler];
    }

    class Checkout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkout",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/Product.svelte generated by Svelte v3.29.4 */
    const file$6 = "src/components/Product.svelte";

    // (43:2) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let icon;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { icon: faShoppingCart },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = text("\n      Add to Cart");
    			attr_dev(button, "class", "btn svelte-1mkyefc");
    			add_location(button, file$6, 43, 4, 1200);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:2) {#if $cartContents.find((el) => el.id === id)}
    function create_if_block$2(ctx) {
    	let button;
    	let icon;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { icon: faMinus }, $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = text("\n      Remove from Cart");
    			attr_dev(button, "class", "btn remove svelte-1mkyefc");
    			add_location(button, file$6, 38, 4, 1053);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(38:2) {#if $cartContents.find((el) => el.id === id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let h3;
    	let t1;
    	let t2;
    	let span;
    	let t3;
    	let t4;
    	let t5;
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let div2_id_value;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*$cartContents, id*/ 17) show_if = !!/*$cartContents*/ ctx[4].find(/*func*/ ctx[7]);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			t1 = text(/*title*/ ctx[1]);
    			t2 = space();
    			span = element("span");
    			t3 = text(/*price*/ ctx[2]);
    			t4 = text("$");
    			t5 = space();
    			if_block.c();
    			attr_dev(div0, "class", "flex items-end justify-end h-56 w-full bg-cover");
    			set_style(div0, "background-image", "url(" + /*img*/ ctx[3] + ")");
    			add_location(div0, file$6, 29, 2, 758);
    			attr_dev(h3, "class", "text-gray-700");
    			add_location(h3, file$6, 34, 4, 899);
    			attr_dev(span, "class", "text-gray-500 mt-2");
    			add_location(span, file$6, 35, 4, 942);
    			attr_dev(div1, "class", "px-5 py-3");
    			add_location(div1, file$6, 33, 2, 871);
    			attr_dev(div2, "id", div2_id_value = String(/*id*/ ctx[0]));
    			attr_dev(div2, "class", "w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden");
    			add_location(div2, file$6, 25, 0, 660);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, span);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			append_dev(div2, t5);
    			if_blocks[current_block_type_index].m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*img*/ 8) {
    				set_style(div0, "background-image", "url(" + /*img*/ ctx[3] + ")");
    			}

    			if (!current || dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);
    			if (!current || dirty & /*price*/ 4) set_data_dev(t3, /*price*/ ctx[2]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, null);
    			}

    			if (!current || dirty & /*id*/ 1 && div2_id_value !== (div2_id_value = String(/*id*/ ctx[0]))) {
    				attr_dev(div2, "id", div2_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $cartContents;
    	validate_store(cartContents, "cartContents");
    	component_subscribe($$self, cartContents, $$value => $$invalidate(4, $cartContents = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Product", slots, []);
    	let { id } = $$props;
    	let { title } = $$props;
    	let { price } = $$props;
    	let { img } = $$props;

    	function addToBasket(id) {
    		productsInCart.update(items => items + 1);
    		cartContents.update(contents => [...contents, { title, price, img, id }]);
    	}

    	function removeFromBasket(id) {
    		productsInCart.update(items => items - 1);
    		cartContents.update(contents => contents.filter(el => el.id !== id));
    	}

    	const writable_props = ["id", "title", "price", "img"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Product> was created with unknown prop '${key}'`);
    	});

    	const func = el => el.id === id;
    	const click_handler = () => removeFromBasket(id);
    	const click_handler_1 = () => addToBasket(id);

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("price" in $$props) $$invalidate(2, price = $$props.price);
    		if ("img" in $$props) $$invalidate(3, img = $$props.img);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		faMinus,
    		faShoppingCart,
    		cartContents,
    		productsInCart,
    		id,
    		title,
    		price,
    		img,
    		addToBasket,
    		removeFromBasket,
    		$cartContents
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("price" in $$props) $$invalidate(2, price = $$props.price);
    		if ("img" in $$props) $$invalidate(3, img = $$props.img);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		id,
    		title,
    		price,
    		img,
    		$cartContents,
    		addToBasket,
    		removeFromBasket,
    		func,
    		click_handler,
    		click_handler_1
    	];
    }

    class Product extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { id: 0, title: 1, price: 2, img: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Product",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !("id" in props)) {
    			console.warn("<Product> was created without expected prop 'id'");
    		}

    		if (/*title*/ ctx[1] === undefined && !("title" in props)) {
    			console.warn("<Product> was created without expected prop 'title'");
    		}

    		if (/*price*/ ctx[2] === undefined && !("price" in props)) {
    			console.warn("<Product> was created without expected prop 'price'");
    		}

    		if (/*img*/ ctx[3] === undefined && !("img" in props)) {
    			console.warn("<Product> was created without expected prop 'img'");
    		}
    	}

    	get id() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get price() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set price(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get img() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var data = [
    	{
    		title: "Product 1",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 50.6,
    		img: "",
    		rating: 2
    	},
    	{
    		title: "Product 2",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 34.99,
    		img: "",
    		rating: 4
    	},
    	{
    		title: "Product 3",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 90.8,
    		img: "",
    		rating: 5
    	},
    	{
    		title: "Product 4",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 20.49,
    		img: "",
    		rating: 3
    	},
    	{
    		title: "Product 5",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 100,
    		img: "",
    		rating: 4
    	},
    	{
    		title: "Product 6",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 83.5,
    		img: "",
    		rating: 5
    	},
    	{
    		title: "Product 7",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 30.49,
    		img: "",
    		rating: 5
    	},
    	{
    		title: "Product 8",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 205,
    		img: "",
    		rating: 5
    	},
    	{
    		title: "Product 9",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 80,
    		img: "",
    		rating: 2
    	},
    	{
    		title: "Product 10",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 79.99,
    		img: "",
    		rating: 5
    	},
    	{
    		title: "Product 11",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 40,
    		img: "",
    		rating: 4
    	},
    	{
    		title: "Product 12",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 43.99,
    		img: "",
    		rating: 4
    	},
    	{
    		title: "Product 13",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 120,
    		img: "",
    		rating: 5
    	},
    	{
    		title: "Product 14",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 99,
    		img: "",
    		rating: 3
    	},
    	{
    		title: "Product 15",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 79.99,
    		img: "",
    		rating: 4
    	},
    	{
    		title: "Product 16",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 50,
    		img: "",
    		rating: 3
    	},
    	{
    		title: "Product 17",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 60,
    		img: "",
    		rating: 4
    	},
    	{
    		title: "Product 18",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 109,
    		img: "",
    		rating: 5
    	},
    	{
    		title: "Product 19",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 20.5,
    		img: "",
    		rating: 5
    	},
    	{
    		title: "Product 20",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 58,
    		img: "",
    		rating: 4
    	},
    	{
    		title: "Product 21",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 99,
    		img: "",
    		rating: 5
    	},
    	{
    		title: "Product 22",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 39.99,
    		img: "",
    		rating: 4
    	},
    	{
    		title: "Product 23",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 20,
    		img: "",
    		rating: 2
    	},
    	{
    		title: "Product 24",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    		price: 39,
    		img: "",
    		rating: 5
    	}
    ];

    /* src/App.svelte generated by Svelte v3.29.4 */
    const file$7 = "src/App.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i].price;
    	child_ctx[7] = list[i].title;
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i].price;
    	child_ctx[7] = list[i].title;
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (20:2) {#if $checkoutOpened}
    function create_if_block_1(ctx) {
    	let checkout;
    	let current;
    	checkout = new Checkout({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(checkout.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkout, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(20:2) {#if $checkoutOpened}",
    		ctx
    	});

    	return block;
    }

    // (58:8) {:else}
    function create_else_block$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*products*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products*/ 8) {
    				each_value_1 = /*products*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(58:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:8) {#if valueSearched}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*productSearched*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*productSearched*/ 2) {
    				each_value = /*productSearched*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(49:8) {#if valueSearched}",
    		ctx
    	});

    	return block;
    }

    // (59:10) {#each products as { price, title }
    function create_each_block_1(ctx) {
    	let product;
    	let current;

    	product = new Product({
    			props: {
    				id: /*i*/ ctx[9],
    				price: /*price*/ ctx[6],
    				title: /*title*/ ctx[7],
    				img: "https://loremflickr.com/320/240"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(product.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(product, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(product.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(product.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(product, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(59:10) {#each products as { price, title }",
    		ctx
    	});

    	return block;
    }

    // (50:10) {#each productSearched as { price, title }
    function create_each_block$1(ctx) {
    	let product;
    	let current;

    	product = new Product({
    			props: {
    				id: /*i*/ ctx[9],
    				price: /*price*/ ctx[6],
    				title: /*title*/ ctx[7],
    				img: "https://loremflickr.com/320/240"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(product.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(product, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const product_changes = {};
    			if (dirty & /*productSearched*/ 2) product_changes.price = /*price*/ ctx[6];
    			if (dirty & /*productSearched*/ 2) product_changes.title = /*title*/ ctx[7];
    			product.$set(product_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(product.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(product.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(product, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(50:10) {#each productSearched as { price, title }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div6;
    	let header;
    	let t0;
    	let t1;
    	let main;
    	let div0;
    	let span0;
    	let svg;
    	let path;
    	let t2;
    	let input;
    	let t3;
    	let div4;
    	let h3;
    	let t5;
    	let div1;
    	let current_block_type_index;
    	let if_block1;
    	let t6;
    	let div3;
    	let div2;
    	let a0;
    	let span1;
    	let t8;
    	let a1;
    	let span2;
    	let t10;
    	let a2;
    	let span3;
    	let t12;
    	let a3;
    	let span4;
    	let t14;
    	let a4;
    	let span5;
    	let t16;
    	let footer;
    	let div5;
    	let logo;
    	let t17;
    	let p;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({ $$inline: true });
    	let if_block0 = /*$checkoutOpened*/ ctx[2] && create_if_block_1(ctx);
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*valueSearched*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	logo = new Logo({
    			props: { width: "150px", height: "80px" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			create_component(header.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			main = element("main");
    			div0 = element("div");
    			span0 = element("span");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			div4 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Our Products";
    			t5 = space();
    			div1 = element("div");
    			if_block1.c();
    			t6 = space();
    			div3 = element("div");
    			div2 = element("div");
    			a0 = element("a");
    			span1 = element("span");
    			span1.textContent = "Previous";
    			t8 = space();
    			a1 = element("a");
    			span2 = element("span");
    			span2.textContent = "1";
    			t10 = space();
    			a2 = element("a");
    			span3 = element("span");
    			span3.textContent = "2";
    			t12 = space();
    			a3 = element("a");
    			span4 = element("span");
    			span4.textContent = "3";
    			t14 = space();
    			a4 = element("a");
    			span5 = element("span");
    			span5.textContent = "Next";
    			t16 = space();
    			footer = element("footer");
    			div5 = element("div");
    			create_component(logo.$$.fragment);
    			t17 = space();
    			p = element("p");
    			p.textContent = "Made with ❤️";
    			attr_dev(path, "d", "M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z");
    			attr_dev(path, "stroke", "currentColor");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$7, 26, 10, 831);
    			attr_dev(svg, "class", "h-5 w-5 text-gray-500");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			add_location(svg, file$7, 25, 8, 753);
    			attr_dev(span0, "class", "absolute inset-y-0 left-0 pl-3 flex items-center");
    			add_location(span0, file$7, 24, 6, 681);
    			attr_dev(input, "class", "search svelte-q718km");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search");
    			add_location(input, file$7, 35, 6, 1157);
    			attr_dev(div0, "class", "relative max-w-lg mx-auto");
    			add_location(div0, file$7, 23, 4, 635);
    			attr_dev(h3, "class", "text-gray-700 text-2xl font-medium");
    			add_location(h3, file$7, 44, 6, 1371);
    			attr_dev(div1, "class", "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6");
    			add_location(div1, file$7, 45, 6, 1442);
    			add_location(span1, file$7, 70, 40, 2191);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "prev-next svelte-q718km");
    			add_location(a0, file$7, 70, 10, 2161);
    			add_location(span2, file$7, 71, 34, 2251);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "num svelte-q718km");
    			add_location(a1, file$7, 71, 10, 2227);
    			add_location(span3, file$7, 72, 34, 2304);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "num svelte-q718km");
    			add_location(a2, file$7, 72, 10, 2280);
    			add_location(span4, file$7, 73, 34, 2357);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "num svelte-q718km");
    			add_location(a3, file$7, 73, 10, 2333);
    			add_location(span5, file$7, 74, 40, 2416);
    			attr_dev(a4, "href", "/");
    			attr_dev(a4, "class", "prev-next svelte-q718km");
    			add_location(a4, file$7, 74, 10, 2386);
    			attr_dev(div2, "class", "flex rounded-md mt-8");
    			add_location(div2, file$7, 69, 8, 2116);
    			attr_dev(div3, "class", "flex justify-center");
    			add_location(div3, file$7, 68, 6, 2074);
    			attr_dev(div4, "class", "container mx-auto mt-5");
    			add_location(div4, file$7, 43, 4, 1328);
    			attr_dev(main, "class", "svelte-q718km");
    			add_location(main, file$7, 22, 2, 624);
    			attr_dev(p, "class", "py-2 text-gray-500 sm:py-0");
    			add_location(p, file$7, 83, 6, 2648);
    			attr_dev(div5, "class", "container mx-auto px-6 py-3 flex justify-between items-center");
    			add_location(div5, file$7, 81, 4, 2523);
    			attr_dev(footer, "class", "bg-gray-200");
    			add_location(footer, file$7, 80, 2, 2490);
    			add_location(div6, file$7, 17, 0, 554);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			mount_component(header, div6, null);
    			append_dev(div6, t0);
    			if (if_block0) if_block0.m(div6, null);
    			append_dev(div6, t1);
    			append_dev(div6, main);
    			append_dev(main, div0);
    			append_dev(div0, span0);
    			append_dev(span0, svg);
    			append_dev(svg, path);
    			append_dev(div0, t2);
    			append_dev(div0, input);
    			set_input_value(input, /*valueSearched*/ ctx[0]);
    			append_dev(main, t3);
    			append_dev(main, div4);
    			append_dev(div4, h3);
    			append_dev(div4, t5);
    			append_dev(div4, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, a0);
    			append_dev(a0, span1);
    			append_dev(div2, t8);
    			append_dev(div2, a1);
    			append_dev(a1, span2);
    			append_dev(div2, t10);
    			append_dev(div2, a2);
    			append_dev(a2, span3);
    			append_dev(div2, t12);
    			append_dev(div2, a3);
    			append_dev(a3, span4);
    			append_dev(div2, t14);
    			append_dev(div2, a4);
    			append_dev(a4, span5);
    			append_dev(div6, t16);
    			append_dev(div6, footer);
    			append_dev(footer, div5);
    			mount_component(logo, div5, null);
    			append_dev(div5, t17);
    			append_dev(div5, p);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(input, "keyup", /*searchProduct*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$checkoutOpened*/ ctx[2]) {
    				if (if_block0) {
    					if (dirty & /*$checkoutOpened*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div6, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*valueSearched*/ 1 && input.value !== /*valueSearched*/ ctx[0]) {
    				set_input_value(input, /*valueSearched*/ ctx[0]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(header);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			destroy_component(logo);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $checkoutOpened;
    	validate_store(checkoutOpened, "checkoutOpened");
    	component_subscribe($$self, checkoutOpened, $$value => $$invalidate(2, $checkoutOpened = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let valueSearched = "";
    	const products = data;
    	let productSearched = [];

    	function searchProduct() {
    		const filtered = products.filter(el => {
    			return el.title.includes(valueSearched);
    		});

    		$$invalidate(1, productSearched = [...filtered]);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		valueSearched = this.value;
    		$$invalidate(0, valueSearched);
    	}

    	$$self.$capture_state = () => ({
    		Header,
    		Checkout,
    		Product,
    		Logo,
    		data,
    		checkoutOpened,
    		valueSearched,
    		products,
    		productSearched,
    		searchProduct,
    		$checkoutOpened
    	});

    	$$self.$inject_state = $$props => {
    		if ("valueSearched" in $$props) $$invalidate(0, valueSearched = $$props.valueSearched);
    		if ("productSearched" in $$props) $$invalidate(1, productSearched = $$props.productSearched);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		valueSearched,
    		productSearched,
    		$checkoutOpened,
    		products,
    		searchProduct,
    		input_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

}());
