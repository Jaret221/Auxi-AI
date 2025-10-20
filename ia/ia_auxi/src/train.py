import json
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder
from model import AuxiNN
import joblib
import os

# Carpeta del modelo
os.makedirs("models", exist_ok=True)

# Cargar datos
with open("data/training_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

def train_network(category):
    corpus = [item['input'] for item in data[category]]
    labels = [item['output'] for item in data[category]]

    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(corpus).toarray()

    label_encoder = LabelEncoder()
    Y = label_encoder.fit_transform(labels)

    input_size = X.shape[1]
    hidden_size = 16
    output_size = len(set(Y))

    model = AuxiNN(input_size, hidden_size, output_size)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)

    X_tensor = torch.tensor(X, dtype=torch.float32)
    Y_tensor = torch.tensor(Y, dtype=torch.long)

    for epoch in range(200):
        outputs = model(X_tensor)
        loss = criterion(outputs, Y_tensor)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if epoch % 20 == 0:
            print(f"[{category}] Epoch {epoch}, Loss: {loss.item():.4f}")

    # Guardar modelo de sklearn por separado
    torch.save(model.state_dict(), f"models/{category}_state.pth")
    joblib.dump(vectorizer, f"models/{category}_vect.pkl")
    joblib.dump(label_encoder, f"models/{category}_labels.pkl")

    print(f"{category.capitalize()} model saved successfully.")

# El Entrenar redes
train_network("general")
train_network("emergency")
