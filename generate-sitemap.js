const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

// Define the domain
const hostname = 'https://americanotennis.com';

// Define the Framework7 routes from your project
const routes = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/create-americano/', changefreq: 'monthly', priority: 0.8 },
  { path: '/americano-game/:id', changefreq: 'weekly', priority: 0.9 }, // Dynamic route
  { path: '/oht/', changefreq: 'monthly', priority: 0.7 },
  { path: '/search/', changefreq: 'monthly', priority: 0.8 },
  { path: '/result/:id', changefreq: 'weekly', priority: 0.9 }, // Dynamic route
  { path: '/discover/', changefreq: 'monthly', priority: 0.8 },
  { path: '/404/', changefreq: 'yearly', priority: 0.1 },
  { path: '/what-is-americano-tennis/', changefreq: 'monthly', priority: 0.8 }
];

// Create a write stream to output the sitemap.xml file
const writeStream = createWriteStream('./sitemap.xml');

// Initialize a SitemapStream object with the domain
const sitemap = new SitemapStream({ hostname });

// Pipe the write stream
sitemap.pipe(writeStream);

// Loop over your routes and add them to the sitemap
routes.forEach(route => {
  const url = route.path.includes(':id') ? route.path.replace(':id', 'example-id') : route.path; // Handling dynamic routes
  sitemap.write({
    url: url,
    changefreq: route.changefreq,
    priority: route.priority
  });
});

// Close the stream when all routes have been added
sitemap.end();

// Convert the stream to a promise (optional)
streamToPromise(sitemap).then(() => {
  console.log('Sitemap generated successfully');
});
