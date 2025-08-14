// Quick test to verify hero update works
const testData = {
  title: "Test Multi-Genre Event",
  hero: true,
  subGenres: ["house", "electronic"]
}

fetch('http://localhost:3000/api/events/test-event-1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer dummy-token'  // This will fail auth but we can see if validation works
  },
  body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err))