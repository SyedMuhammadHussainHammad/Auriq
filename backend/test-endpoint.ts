import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function test() {
  try {
    // 1. Admin login to get token
    const loginRes = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'uzairahmed@auriqfragrances.com',
      password: 'newsecurepassword123'
    });
    const token = loginRes.data.data.accessToken;
    console.log('Got token:', token.substring(0, 20) + '...');

    // 2. Create Ad
    const form = new FormData();
    form.append('title', 'Test Ad');
    form.append('position', 'ANNOUNCEMENT_BAR');
    
    // We don't upload an image for announcement bar
    const createRes = await axios.post('http://localhost:5000/api/admin/ads', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    const ad = createRes.data.data;
    console.log('Created ad:', ad.id);

    // 3. Delete Ad
    console.log('Attempting to delete ad:', ad.id);
    const deleteRes = await axios.delete(`http://localhost:5000/api/admin/ads/${ad.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Delete result:', deleteRes.data);

  } catch (err: any) {
    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

test();
