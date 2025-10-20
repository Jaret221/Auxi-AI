import torch
from src.model import AuxiNN
import joblib
import json
import os

# Crear la carpeta models si no existe
os.makedirs("models", exist_ok=True)

# Palabras clave
EMERGENCY_KEYWORDS = [
    "shock", "quemadura", "herida", "sangrado", "insolación", 
    "golpe de calor", "fractura", "asfixia", "convulsiones", 
    "desmayo", "intoxicación"
]

# Función para cargar modelo
def load_model(category):
    state_path = f"models/{category}_state.pth"
    vect_path = f"models/{category}_vect.pkl"
    labels_path = f"models/{category}_labels.pkl"

    if not os.path.exists(state_path):
        raise FileNotFoundError(f"Modelo {category} no encontrado. Ejecuta train.py primero.")

    state_dict = torch.load(state_path)
    vectorizer = joblib.load(vect_path)
    label_encoder = joblib.load(labels_path)

    input_size = len(vectorizer.get_feature_names_out())
    hidden_size = 16
    output_size = len(label_encoder.classes_)

    model = AuxiNN(input_size, hidden_size, output_size)
    model.load_state_dict(state_dict)
    model.eval()

    return model, vectorizer, label_encoder

# Cargar modelos
general_model, general_vect, general_labels = load_model("general")
emergency_model, emergency_vect, emergency_labels = load_model("emergency")

# Función de predicción
def predict(user_input):
    category = "emergency" if any(word in user_input.lower() for word in EMERGENCY_KEYWORDS) else "general"

    if category == "emergency":
        x = emergency_vect.transform([user_input]).toarray()
        x_tensor = torch.tensor(x, dtype=torch.float32)
        output = emergency_model(x_tensor)
        _, pred = torch.max(output, 1)
        return emergency_labels.inverse_transform([pred.item()])[0], category
    else:
        x = general_vect.transform([user_input]).toarray()
        x_tensor = torch.tensor(x, dtype=torch.float32)
        output = general_model(x_tensor)
        _, pred = torch.max(output, 1)
        return general_labels.inverse_transform([pred.item()])[0], category

# Función para agregar nuevas frases
def add_new_phrase(user_input, response, category):
    data_file = "data/training_data.json"

    # Cargar datos actuales
    with open(data_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Agregar nueva frase
    data[category].append({"input": user_input, "output": response})

    # Guardar datos actualizados
    with open(data_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"Nueva frase agregada a {category}.")
