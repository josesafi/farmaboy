async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: "josesafi9508@gmail.com",
        password: "4DtQPfDz"
      })
    });
    const data = await res.json();
    console.log("LOGIN RESULT:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("TEST FAILED:", err);
  }
}

test();
