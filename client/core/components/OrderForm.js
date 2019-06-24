
import Vue from "https://cdn.jsdelivr.net/npm/vue/dist/vue.esm.browser.js"
import { EventBus } from "./EventBus.js"

export const OrderForm = Vue.component('order-form', {
    template: `
        <div class="modal fade" id="orderDialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Make order</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="result !== ''" class="alert" :class="alertClass" role="alert">
                            {{result}}
                        </div>
                        <form id="orderForm" @submit.prevent.stop="makeOrder">
                            <div class="form-group">
                                <label for="book-name" class="col-form-label">Book: </label>
                                <input id="book-name" type="text" class="form-control" v-model="order.bookName" :disabled="true">
                            </div>
                            <div class="form-group">
                                <label for="last-name" class="col-form-label">Last name: </label>
                                <input id="last-name" type="text" class="form-control" v-model="order.lastName">
                            </div>
                            <div class="form-group">
                                <label for="first-name" class="col-form-label">First name: </label>
                                <input id="first-name" type="text" class="form-control" v-model="order.firstName">
                            </div>
                            <div class="form-group">
                                <label for="address" class="col-form-label">Address: </label>
                                <input id="address" type="text" class="form-control" v-model="order.address">
                            </div>
                            <div class="form-group">
                                <label for="quantity" class="col-form-label">Quantity: </label>
                                <input id="quantity" type="number" class="form-control" v-model="order.quantity">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" form="orderForm">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            order: {
                bookName: "",
                lastName: "",
                firstName: "",
                address: "",
                quantity: 0
            },
            result: "",
            alertClass: ""
        }
    },
    mounted() {
        EventBus.$on("BookSelected", (book) => {
            this.order.bookName = book.name;

            $("#orderDialog").modal({
                show: true
            });
        });


        $("#orderDialog").on('hide.bs.modal', () => {
            this.result = "";
            this.alertClass = "";
        })
    },
    beforeDestroy() {
        EventBus.$off("BookSelected");
    },
    methods: {
        makeOrder() {
            axios.put("/api/book/order", this.order).then((response) => {
                const makeOrderResult = response.data;

                const submitDetails = makeOrderResult.details;
                if (submitDetails === "FAILURE") {
                    this.result = "Your order is not created!";
                    this.alertClass = "alert-danger";
                } else if (submitDetails === "ORDER_EXISTS") {
                    this.result = "You ordered this book already!";
                    this.alertClass = "alert-warning";
                } else {
                    this.result = "Your order created successfully!";
                    this.alertClass = "alert-success";
                }
            }, (error) => {
                this.result = "Your order is not created! Some errors occured in server! Please try again later.";
                this.alertClass = "alert-danger";
            })
        },
    }
});