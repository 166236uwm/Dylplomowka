const API_URL = 'http://localhost:5140/api';

export const apiRequest = async (url, token = null, bodyParams = null, method = 'GET') => {
  const headers = {
    'Content-Type': bodyParams ? 'application/json' : 'text/plain',
  };

  if (token) {
    headers['Authorization'] = token;
  }

  //console.log(`Request URL: ${API_URL}/${url}`);
  //console.log(`Request Method: ${method}`);
  //console.log(`Request Headers:`, headers);
  //console.log(`Request Body:`, bodyParams);

  const response = await fetch(`${API_URL}/${url}`, {
    method: method,
    headers: headers,
    body: bodyParams ? JSON.stringify(bodyParams) : null,
  });

  const responseText = await response.text();
  //console.log(`Response Text:`, responseText);

  if (!response.ok) {
    console.error(`Request failed: ${response.statusText}`);
    console.error(`Response Data:`, responseText);
    throw new Error(`Request failed: ${response.statusText}`);
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    try {
      return JSON.parse(responseText);
    } catch (err) {
      console.error(`Failed to parse JSON:`, err);
      throw new Error(`Failed to parse JSON: ${responseText}`);
    }
  } else {
    return responseText;
  }
};