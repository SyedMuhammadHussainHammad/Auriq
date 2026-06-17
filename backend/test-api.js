const http = require('http');

const data = JSON.stringify({
  email: 'uzairahmed@auriqfragrances.com',
  password: 'newsecurepassword123'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const token = JSON.parse(body).data.accessToken;
    
    // Create Ad
    const FormData = require('form-data');
    const form = new FormData();
    form.append('title', 'Test Ad');
    form.append('position', 'ANNOUNCEMENT_BAR');
    
    const req2 = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/ads',
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    }, (res2) => {
      let body2 = '';
      res2.on('data', chunk => body2 += chunk);
      res2.on('end', () => {
        console.log("Create ad response:", body2);
        try {
          const ad = JSON.parse(body2).data;
          
          if (!ad) {
            console.error("Ad creation failed:", body2);
            return;
          }

          console.log("Deleting ad", ad.id);
          const req3 = http.request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/admin/ads/${ad.id}`,
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }, (res3) => {
            let body3 = '';
            res3.on('data', chunk => body3 += chunk);
            res3.on('end', () => {
              console.log("Delete ad response:", body3);
            });
          });
          req3.end();

        } catch(e) {
          console.error(e);
        }
      });
    });
    form.pipe(req2);
  });
});

req.write(data);
req.end();
