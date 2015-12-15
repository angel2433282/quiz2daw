var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null,
			{dialect: "sqlite", storage: "quiz.sqlite"}
		);

var Alumno = sequelize.import(path.join(__dirname, 'alumno'))
var Comment = sequelize.import(path.join(__dirname, 'comment'));
var Cuestionario = sequelize.import(path.join(__dirname, 'cuestionario'));
var CuestionarioAsignado = sequelize.import(path.join(__dirname,'cuestionarioAsignado'));
var Grupo = sequelize.import(path.join(__dirname, 'grupo'));
var Materia = sequelize.import(path.join(__dirname, 'materia'));
var Observacion = sequelize.import(path.join(__dirname, 'observacion'));
var Profesor = sequelize.import(path.join(__dirname, 'profesor'));
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var User = sequelize.import(path.join(__dirname, 'user'));

//1:m (no concreto)
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//n:m
Profesor.belongsTo(User, {foreignKey:'userId'});
Alumno.belongsTo(User, {foreignKey:'userId'});

//1:m (concreto)
Grupo.belongsTo(Profesor, {foreignKey: 'creador'});
Profesor.hasMany(Grupo);

//1:m (concreto)
Cuestionario.belongsTo(Profesor, {foreignKey: 'creador'});
Profesor.hasMany(Cuestionario);

//Tabla intermedia
Grupo.belongsToMany(Cuestionario, {through: 'CuestionarioAsignado'});
Cuestionario.belongsToMany(Grupo, {through: 'CuestionarioAsignado'});

Alumno.belongsTo(Grupo);
Grupo.hasMany(Alumno);

Quiz.belongsTo(Cuestionario);
Cuestionario.hasMany(Quiz);

Grupo.belongsTo(Cuestionario);
Cuestionario.hasMany(Grupo);

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// then(..) ejecuta el manejador una vez creada la tabla
	User.count().then(function(count) {
		if(count === 0) { // la tabla se inicializa solo si está vacía
		User.create({ username: 'admin' ,
					  password: '1234'
		});
                User.create({ username: 'jose' ,
					  password: '4321'
		});
		User.create({ username: 'pepe' ,
					  password: '4321'
		})
		.then(function(){console.log('Tabla User inicializada')});
		};
	});

	Quiz.count().then(function(count) {
		if(count === 0) { // la tabla se inicializa solo si está vacía
		Quiz.create({ pregunta: 'Capital de Italia',
                                respuesta: 'Roma'
		});
		Quiz.create({ pregunta: 'Capital de Portugal',
                                respuesta: 'Lisboa'
		})
		.then(function(){console.log('Tabla Quiz inicializada')});
		};
	
	});
        
        Grupo.count().then(function(count) {
            if(count === 0) { // la tabla se inicializa solo si está vacía
		Grupo.create({ anyo: '2014/15',
                        grupo: '1�E.S.O.',
                        subgrupo: 'A',
                        ensenanza: 'E.S.O.',
                        Curso: '1'
		})
		.then(function(){console.log('Tabla Grupos inicializada')});
            };
	});
        
        Alumno.count().then(function(count) {
            if(count === 0) { // la tabla se inicializa solo si está vacía
		Alumno.create({ dni: '52748123A',
                        apellido1: 'Pérez',
                        apellido2: 'López',
                        nombre: 'Juan',
                        email: 'Juan@gmail.com',
                        userId: 3,
                        GrupoId: 1
		})
		.then(function(){console.log('Tabla Alumnos inicializada')});
            };
	});
                
	Profesor.count().then(function(count) {
		if(count === 0) { // la tabla se inicializa solo si está vacía
		Profesor.create({ apellidos: 'Sierra Olmo' ,
			  nombre: 'Alberto',
			  email: 'albertosierra@gmail.com',
			  dni: '12345678E',
			  movil: '699699699',
			  departamento: 'Informatica',
			  userId: 1
		});
                Profesor.create({ apellidos: 'Perez Reverte' ,
			  nombre: 'Juan',
			  email: 'reverteverte@gmail.com',
			  dni: '87654321G',
			  movil: '699699699',
			  departamento: 'Informatica',
			  userId: 2
		})
		.then(function(){console.log('Tabla Profesor inicializada')});
		};
	});
        
        Cuestionario.count().then(function(count) {
            if(count === 0) { // la tabla se inicializa solo si está vacía
		Cuestionario.create({ creador: '1',
                        observaciones: 'Ejemplo de observacion',
                        fechaFin: '12-10.2015'
		})
		.then(function(){console.log('Tabla Cuestionarios inicializada')});
            };
	});

	Materia.count().then(function(count) {
		if(count === 0) { // la tabla se inicializa solo si esta vacia
		Materia.create({ materia: 'servidor', ensenanza: 'informatica', curso: '2DAW'
					 
		});
		Materia.create({ materia: 'cliente', ensenanza: 'informatica', curso: '2DAW'
		})
		.then(function(){console.log('Tabla Materia inicializada')});
		};
	});
});

exports.Alumno = Alumno;
exports.Comment = Comment;
exports.Cuestionario = Cuestionario;
exports.CuestionarioAsignado = CuestionarioAsignado;
exports.Grupo = Grupo;
exports.Materia = Materia;
exports.Observacion = Observacion;
exports.Profesor = Profesor;
exports.Quiz = Quiz; 
exports.User = User;
