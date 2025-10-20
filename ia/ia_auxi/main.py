from src.chatbot import predict, add_new_phrase

print("Auxi Chatbot listo. Escribe 'salir' para terminar.")
print("Si quieres agregar una nueva frase, escribe: agregar: tu frase")

while True:
    entrada = input("Tú: ")

    if entrada.lower() == "salir":
        print("Auxi: ¡Adiós!")
        break

    if entrada.lower().startswith("agregar:"):
        try:
            # Formato: agregar:frase|respuesta
            _, text = entrada.split("agregar:", 1)
            frase, respuesta = text.split("|")
            pred, category = predict(frase.strip())
            add_new_phrase(frase.strip(), respuesta.strip(), category)
            print(f"Auxi: Frase añadida bajo categoría '{category}'")
        except:
            print("Auxi: Error al agregar. Usa el formato 'agregar:frase|respuesta'")
        continue

    respuesta, _ = predict(entrada)
    print(f"Auxi: {respuesta}")
