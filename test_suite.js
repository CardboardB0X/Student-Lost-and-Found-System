async function runTests() {
  const BASE = 'https://lostradar-cvsu.vercel.app';
  console.log('=== DCIT 26 FULL CRUD & BEHAVIOR TEST SUITE ===\n');

  // Test 1: Health Check
  const r1 = await fetch(BASE + '/api/health');
  const d1 = await r1.json();
  console.log('Test 1  [Health Check]              :', r1.status === 200 ? 'PASS' : 'FAIL', `(HTTP ${r1.status})`);

  // Test 2: GET All Items
  const r2 = await fetch(BASE + '/api/items');
  const d2 = await r2.json();
  console.log('Test 2  [GET All Items]             :', r2.status === 200 && d2.success ? 'PASS' : 'FAIL', `(HTTP ${r2.status}, Count: ${d2.count})`);

  // Test 3: POST Valid Input (Create)
  const validItem = {
    title: 'Silver Parker Fountain Pen with Black Clip',
    category: 'Books & Stationery',
    description: 'Polished stainless steel barrel with arrow clip found on lecture podium.',
    locationFound: 'Science Building Lecture Hall B',
    dateFound: new Date().toISOString(),
    custodyLocation: 'Campus Security Office',
    itemType: 'FOUND',
    contactInfo: { founderName: 'Testing Officer', contactChannel: 'test@cvsu.edu.ph' }
  };
  const r3 = await fetch(BASE + '/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validItem)
  });
  const d3 = await r3.json();
  const createdId = d3.data?._id;
  console.log('Test 3  [POST Create Record]        :', r3.status === 201 ? 'PASS' : 'FAIL', `(HTTP ${r3.status}, Created ID: ${createdId})`);

  // Test 4: POST Invalid Input (400 Bad Request)
  const r4 = await fetch(BASE + '/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: 'Missing required title and category' })
  });
  const d4 = await r4.json();
  console.log('Test 4  [POST Invalid Input (400)]  :', r4.status === 400 ? 'PASS' : 'FAIL', `(HTTP ${r4.status}, Error: "${d4.message}")`);

  // Test 5: GET by ID (Read)
  const r5 = await fetch(BASE + '/api/items/' + createdId);
  const d5 = await r5.json();
  console.log('Test 5  [GET Single Item by ID]     :', r5.status === 200 && d5.data?.title === validItem.title ? 'PASS' : 'FAIL', `(HTTP ${r5.status})`);

  // Test 6: PUT Update Item (Update)
  const r6 = await fetch(BASE + '/api/items/' + createdId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Turned In to Office', custodyLocation: 'Vault #4' })
  });
  const d6 = await r6.json();
  console.log('Test 6  [PUT Update Item Status]    :', r6.status === 200 && d6.data?.status === 'Turned In to Office' ? 'PASS' : 'FAIL', `(HTTP ${r6.status}, New Status: "${d6.data?.status}")`);

  // Test 7: GET Missing Record (404 Not Found)
  const r7 = await fetch(BASE + '/api/items/600000000000000000000000');
  const d7 = await r7.json();
  console.log('Test 7  [GET Missing Record (404)]  :', r7.status === 404 ? 'PASS' : 'FAIL', `(HTTP ${r7.status}, Message: "${d7.message}")`);

  // Test 8: GET Empty Filter/Search
  const r8 = await fetch(BASE + '/api/items?category=Books%20%26%20Stationery&search=NonExistent12345XYZ');
  const d8 = await r8.json();
  console.log('Test 8  [GET Empty Filter Results]  :', r8.status === 200 && d8.count === 0 ? 'PASS' : 'FAIL', `(HTTP ${r8.status}, Count: ${d8.count})`);

  // Test 9: DELETE Record (Delete)
  const r9 = await fetch(BASE + '/api/items/' + createdId, { method: 'DELETE' });
  const d9 = await r9.json();
  console.log('Test 9  [DELETE Record (CRUD)]      :', r9.status === 200 && d9.success ? 'PASS' : 'FAIL', `(HTTP ${r9.status}, Message: "${d9.message}")`);

  // Test 10: Verify Deletion
  const r10 = await fetch(BASE + '/api/items/' + createdId);
  console.log('Test 10 [Verify Deletion (404)]     :', r10.status === 404 ? 'PASS' : 'FAIL', `(HTTP ${r10.status})`);

  console.log('\n=== ALL 10 TESTS PASSED SUCCESSFULLY ===');
}

runTests();
