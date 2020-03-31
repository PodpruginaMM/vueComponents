Vue.component('search', {
    props: ['filtered', 'products'],
    template: `
<form action="#" class="search-form" @submit.prevent="filter($event)">
        <input type="text" class="search-field" v-bind:filtered="filtered" v-bind:userSearch="userSearch" v-bind:products="products" v-on:input="userSearch = $event.target.userSearch">
        <button class="btn-search" type="submit">
        <i class="fas fa-search"></i>
        </button>
        </form>
`,
    data(){
        return {
            userSearch: '',
        }
    },
    methods: {
        filter() {
            let regexp = new RegExp(this.userSearch, 'i');
            this.$parent.filtered = this.$parent.products.filter(el => regexp.test(el.product_name));
        },
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product) {
            this.$parent.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartItems.find(el => el.id_product === product.id_product);
                        if (find) {
                            find.quantity++;
                        } else {
                            let prod = Object.assign({quantity: 1}, product);
                            this.cartItems.push(prod)
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
        remove(item) {
            this.$parent.getJson(`${API}/deleteFromBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        if (item.quantity > 1) {
                            item.quantity--;
                        } else {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1)
                        }
                    }
                })
        },
    },
});

new Vue({ el: '#search-app'})