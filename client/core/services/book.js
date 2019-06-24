
class BookService {

	getAllBooks() {
		return axios.get("/api/book/all")
	}

	addNewBook(book) {
		return axios.put("/api/book/add", book)
	}

	updateBook(book) {
		return axios.put("/api/book/update", book)
	}

	orderBook() {
		return axios.put("/api/book/order", book)
	}
}

export const bookService = new BookService()