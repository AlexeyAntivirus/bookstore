
import Vue from "https://cdn.jsdelivr.net/npm/vue/dist/vue.esm.browser.js"
import { logger } from "../services/log.js"
import { bookService } from "../services/book.js"
import { AddBookForm } from "./AddBookForm.js"
import { BooksDataTable } from "./BooksDataTable.js"
import { OrderForm } from "./OrderForm.js"
import { UpdateBookForm } from "./UpdateBookForm.js"
import { EventBus } from "./EventBus.js"

const RuntimeMixin = {
	data() {
		return {
			books: []
		}
	},
	mounted() {
		bookService.getAllBooks()
			.then((response) => {
				logger.info(response.data, "console", "ui")
				this.books = response.data
			})
			.catch((response) => {
				logger.info(response.error, "console", "ui")
				this.books = []
			})
	}
}

export function createUserRuntime() {
	return new Vue({
		el: "#user",
		mixins: [RuntimeMixin],
		template: `
			<div id="app" class="container-fluid">
        	    <div class="alert alert-info" role="alert">
        	        Login <a href="/admin">here</a>
        	    </div>
        	    <div class="alert alert-info" role="alert">
        	        Please, choose a book from the book list to purchase.
        	    </div>
				<div class="row">
                	<div class="col-md">
                    	<books-data-table :books-data="books"></books-data-table>
                	</div>
            	</div>
            	<order-form></order-form>
			</div>
		`,
		components: {
			BooksDataTable,
			OrderForm,
		},
	})
}

export function createAdminRuntime() {
	return new Vue({
		el: "#admin",
		mixins: [RuntimeMixin],
		template: `
			<div id="app" class="container-fluid">
				<div class="alert alert-info" role="alert">
					Please choose a book from the book list to edit information.
				</div>
				<div class="row">
					<div class="col-md">
						<books-data-table :books-data="books">
							<button slot="admin" class="btn btn-primary" @click.prevent.stop="addBook()">&#43; Add new book</button>
						</books-data-table>
					</div>
				</div>
				<update-book-form></update-book-form>
				<add-book-form></add-book-form>
			</div>
		`,
		components: {
			BooksDataTable,
			UpdateBookForm,
			AddBookForm
		},
		mounted() {
			EventBus.$on("ManagedBooksEvent", (managedBookList) => {
				this.books = managedBookList;
			})
		},
		methods: {
			addBook() {
				$("#addBookDialog").modal("show")
			}
		}
	})
}