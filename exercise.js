
// getCustomer(1, (customer) => {
//   console.log('Customer: ', customer);
//   if (customer.isGold) {
//     getTopMovies((movies) => {
//       console.log('Top movies: ', movies);
//       sendEmail(customer.email, movies, () => {
//         console.log('Email sent...')
//       });
//     });
//   }
// });

async function sendTopMovies(id) {
  try {
    const customer = await getCustomer(id);
    console.log('Customer: ', customer);
    if (customer.isGold) {
      const movies = await getTopMovies();
      console.log('Top movies: ', movies);
      
      await sendEmail(customer.email);
      console.log('Email sent...')
    }
  }
  catch(err) {
    console.error('Error: ' + err);
  }
  
}

sendTopMovies(1);

function getCustomer(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'Abhishek Bhattacherjee',
        isGold: true,
        email: 'email'
      });
    }, 4000);
  });
  
}

function getTopMovies() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(['movie1', 'movie2']);
    }, 4000);
  });
  
}

function sendEmail(email, movies, callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 4000);
  });
  
}