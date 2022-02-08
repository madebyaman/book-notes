const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const fetch = require('node-fetch');

// When a new book is added to the books collection, get its photoURL, store it in the storage and update the URL.
export const updateBook = functions.firestore
  .document('/books/{bookId}')
  .onCreate(async (snapshot: any, context: any) => {
    const book = snapshot.data();
    const bookId = context.params.bookId;
    const coverID = book.cover;
    if (coverID) {
      // First, get the photoURL from the storage.
      const photoURL = `https://covers.openlibrary.org/b/id/${coverID}-L.jpg`;
      // Then, store it in the storage.
      const bucket = admin.storage().bucket('book-cover');
      const file = bucket.file(`${bookId}.jpg`);
      fetch(photoURL).then((res: any) => {
        const contentType = res.headers.get('content-type');
        const writeStream = file.createWriteStream({
          metadata: {
            contentType,
            metadata: {
              myValue: 'my-value',
            },
          },
        });
        res.body.pipe(writeStream);
      });

      // Finally, update the book with the photoURL.
      return snapshot.ref.update({
        photoURL: `https://firebasestorage.googleapis.com/v0/b/book-cover.appspot.com/o/${bookId}.jpg?alt=media`,
      });
    }
  });
