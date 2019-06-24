
import Vue from "https://cdn.jsdelivr.net/npm/vue/dist/vue.esm.browser.js"
import { EventBus } from "./EventBus.js"

export const AddBookForm = Vue.component('add-book-form', {
    template: `
        <div class="modal fade" id="addBookDialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add book</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="result !== ''" class="alert" :class="alertClass" role="alert">
                            {{result}}
                        </div>
                        <form id="addBookForm" @submit.prevent.stop="addBook">
                            <div class="form-group">
                                <label for="book-name" class="col-form-label">Name: </label>
                                <input id="book-name" type="text" class="form-control" v-model="book.name">
                            </div>
                            <div class="form-group">
                                <label for="price" class="col-form-label">Price: </label>
                                <input id="price" type="text" class="form-control" v-model="book.price">
                            </div>
                            <div class="form-group">
                                <label for="description" class="col-form-label">Description: </label>
                                <textarea id="description" class="form-control" v-model="book.description"></textarea>
                            </div>
                            <div class="form-row">
                                <label class="col-form-label col-md-10">Genres: </label>
                                <button class="btn btn-sm btn-primary col-md-2" @click.prevent.stop="addGenre">Add genre</button>
                                <div class="form-group input-group col-md-12 mt-2" v-for="genre in book.genres" :key="genre.id">
                                    <input id="price" type="text" placeholder="Genre name"
                                        class="form-control" v-model="book.genres[book.genres.indexOf(genre)].name">
                                    <div class="input-group-append">
                                        <button class="btn btn-sm btn-danger" @click.prevent.stop="deleteGenre(genre)">Delete genre</button>  
                                    </div>
                                </div>
                            </div>
                            <div class="form-row">
                                <label class="col-form-label col-md-10">Authors: </label>
                                <button class="btn btn-sm btn-primary col-md-2" @click.prevent.stop="addAuthor">Add author</button>
                                <div class="form-group input-group col-md-12 mt-2" v-for="author in book.authors" :key="author.id">
                                    <input id="price" type="text" placeholder="Last name"
                                        class="form-control" v-model="book.authors[book.authors.indexOf(author)].lastName">
                                    <input id="price" type="text" placeholder="First name"
                                        class="form-control" v-model="book.authors[book.authors.indexOf(author)].firstName">
                                    <input id="price" type="text" placeholder="Middle name"
                                        class="form-control" v-model="book.authors[book.authors.indexOf(author)].middleName">
                                    <div class="input-group-append">
                                        <button class="btn btn-sm btn-danger" @click.prevent.stop="deleteAuthor(author)">Delete author</button>  
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" form="addBookForm">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            book: {
                id: null, //Should be null!!
                name: "",
                price: "",
                description: "",
                genres: [],
                authors: []
            },
            result: "",
            alertClass: ""
        }
    },
    mounted() {
        $("#addBookDialog").on('hide.bs.modal', () => {
            this.showWhen = false;
            this.submitDetails = "";
            this.result = "";
        })
    },
    methods: {
        addBook() {
            axios.put("/api/book/add", this.book).then((response) => {
                const manageBookResult = response.data;

                const submitDetails = manageBookResult.details;
                if (submitDetails === "FAILURE") {
                    this.result = "Your book is not added!";
                    this.alertClass = "alert-danger"
                } else if (submitDetails === "BOOK_EXISTS") {
                    this.result = "Book with specified name is exists!";
                    this.alertClass = "alert-warning"
                } else {
                    this.result = "Your book added successfully!";
                    this.alertClass = "alert-success";
                }
                return axios.get("/api/book/all")
            }, (error) => {
                this.submitDetails = "FAILURE";
                this.result = "Your book is not added! Some errors occured in server! Please try again later.";
                this.alertClass = "alert-danger";
            })
            .then((response) => {
                EventBus.$emit("ManagedBooksEvent", response.data)
            })
        },
        addGenre() {
            this.book.genres.push({
                name: ""
            })
        },
        deleteGenre(genre) {
            this.book.genres.splice(this.book.genres.indexOf(genre), 1)
        },
        addAuthor() {
            this.book.authors.push({
                lastName: "",
                firstName: "",
                middleName: ""
            })
        },
        deleteAuthor(author) {
            this.book.authors.splice(this.book.authors.indexOf(author), 1)
        },
    }
});