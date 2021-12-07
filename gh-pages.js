import { publish } from 'gh-pages';

publish(
 'build', // path to public directory
 {
  branch: 'gh-pages',
  repo: 'https://github.com/ivanlori/Sveltemmerce',
  user: {
   name: 'ivanlori',
   email: 'ivan.lori@protonmail.com'
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);