
import Vue from "https://cdn.jsdelivr.net/npm/vue/dist/vue.esm.browser.js"
import { EventBus } from "./EventBus.js"

export const UpdateBookForm = Vue.component('update-book-form', {
    template: `
        <div class="modal fade" id="updateBookDialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Update book</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="result !== ''" class="alert" :class="alertClass" role="alert">
                            {{result}}
                        </div>
                        <form id="updateBookForm" @submit.prevent.stop="updateBook">
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
                                    <input id="price" type="text"
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
                                    <input id="price" type="text"
                                        class="form-control" v-model="book.authors[book.authors.indexOf(author)].lastName">
                                    <input id="price" type="text"
                                        class="form-control" v-model="book.authors[book.authors.indexOf(author)].firstName">
                                    <input id="price" type="text"
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
                        <button type="submit" class="btn btn-primary" form="updateBookForm">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            book: {
                name: "",
                price: "",
                description: "",
                genres: [],
                authors: []
            },
            result: ""
        }
    },
    mounted() {
        EventBus.$on("BookSelected", (book) => {
            this.book = JSON.parse(JSON.stringify(book));

            $("#updateBookDialog").modal({
                show: true
            });
        });

        $("#updateBookDialog").on('hide.bs.modal', () => {
            this.result = "";
            this.alertClass = ""
        })
    },
    beforeDestroy() {
        EventBus.$off("BookSelected");
    },
    methods: {
        updateBook() {
            axios.post("/api/book/update", this.book).then((response) => {
                const manageBookResult = response.data;

                const submitDetails = manageBookResult.details;
                if (submitDetails === "FAILURE") {
                    this.result = "Your book not updated!";
                    this.alertClass = "alert-danger"
                } else {
                    this.result = "Your book updated successfully!";
                    this.alertClass = "alert-success";
                }

                return axios.get("/api/book/all")
            }, (error) => {
                this.result = "Your book not updated!";
                this.alertClass = "alert-danger"
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