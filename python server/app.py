from flask import Flask, request, jsonify
import cv2
import numpy as np
from joblib import load
import traceback
import os

app = Flask(__name__)

# Global variables to store models
model150, model250, model350 = None, None, None

# Load Models
try:
    model_path_150 = 'E:/FIFA Backend/NodeJsExpress/AI_model/best_tree_150px_Gray.pkl'
    model_path_250 = 'E:/FIFA Backend/NodeJsExpress/AI_model/best_tree_250px_Gray.pkl'
    model_path_350 = 'E:/FIFA Backend/NodeJsExpress/AI_model/best_tree_350px_Gray.pkl'

    print("Checking model paths...")
    print(f"Model path 150: {model_path_150}")
    print(f"Model path 250: {model_path_250}")
    print(f"Model path 350: {model_path_350}")

    # Loading each model with detailed logging
    if os.path.exists(model_path_150):
        model150 = load(model_path_150)
        print("Model 150 loaded successfully!")
    else:
        print(f"Model 150 not found at {model_path_150}")

    if os.path.exists(model_path_250):
        model250 = load(model_path_250)
        print("Model 250 loaded successfully!")
    else:
        print(f"Model 250 not found at {model_path_250}")

    if os.path.exists(model_path_350):
        model350 = load(model_path_350)
        print("Model 350 loaded successfully!")
    else:
        print(f"Model 350 not found at {model_path_350}")

except Exception as e:
    print(f"Error loading models: {str(e)}")
    traceback.print_exc()

# Utility function to preprocess image (Denoising and corner trimming)
def preprocess_image(image):
    try:
        image = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
        image = cv2.GaussianBlur(image, (5, 5), 1.5)  # Denoising
        height, width = image.shape
        image = image[5:height - 5, 5:width - 5]  # Corner trimming
        return image  # Return the preprocessed image as a numpy array
    except Exception as e:
        print(f"Error in image preprocessing: {str(e)}")
        traceback.print_exc()
        raise e

@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("Loading models...")

        # Check if models are loaded
        if not model150 or not model250 or not model350:
            print("One or more models are not loaded properly.")
            return jsonify({'error': 'Models are not loaded properly'}), 500

        image_file = request.files['image']
        user_id = request.form.get('userId')  # Assuming userId is sent in the form data
        image_data = image_file.read()
        preprocessed_image = preprocess_image(image_data)

        # Resize the preprocessed image to the input size required by the models
        resized_image = cv2.resize(preprocessed_image, (150, 150))  # Adjust size as needed
        reshaped_image = resized_image.flatten().reshape(1, -1)  # Reshape for the model

        # Run predictions
        prediction150 = model150.predict(reshaped_image)
        prediction250 = model250.predict(reshaped_image)
        prediction350 = model350.predict(reshaped_image)

        # Majority voting for final prediction
        final_prediction = majority_voting([prediction150, prediction250, prediction350])

        return jsonify({
            'status': 200,
            'message': 'Prediction successful!',
            'prediction': final_prediction[0],  # Adjusted to return prediction correctly
            'userId': user_id,
        }), 200

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

def majority_voting(predictions):
    try:
        vote_count = {}
        for pred in predictions:
            pred_value = pred[0]  # Adjusting to get the correct value from the array
            vote_count[pred_value] = vote_count.get(pred_value, 0) + 1
        return [max(vote_count, key=vote_count.get)]  # Returning as a list for consistency
    except Exception as e:
        print(f"Error in majority voting: {str(e)}")
        traceback.print_exc()
        raise e

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
