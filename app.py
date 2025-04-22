from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo de Producto
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)
    description = db.Column(db.String(200))

# Ruta para cargar la página HTML
@app.route('/')
def index():
    return render_template('index.html')

# API: Obtener todos los productos (GET)
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'description': product.description
    } for product in products])

# API: Crear producto (POST)
@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.get_json()
    new_product = Product(
        name=data['name'],
        price=data['price'],
        description=data['description']
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'message': 'Producto creado!'}), 201

# API: Actualizar producto (PUT)
@app.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get(id)
    data = request.get_json()
    product.name = data['name']
    product.price = data['price']
    product.description = data['description']
    db.session.commit()
    return jsonify({'message': 'Producto actualizado!'})

# API: Eliminar producto (DELETE)
@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Producto eliminado!'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)