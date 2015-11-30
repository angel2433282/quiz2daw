var models = require('../models/models.js'); //coje el modelo estructura de cuestionario

exports.load = function(req, res, next, cuestionarioId) {
		models.Cuestionario.find({
			where: {
				id: Number(cuestionarioId)
			},
			include: [{ model: models.Profesor }]
		}).then(function(cuestionario) {
			if(cuestionario) {
				req.cuestionario = cuestionario;
				next();
			} else { next(new Error('No existe commentId=' + cuestionarioId))}	
		}
	).catch(function(error){next(error)});
}

//  GET/cuestionarios VISTA DE LISTA CUESTIONARIOS
exports.index = function(req, res) {
	models.Cuestionario.findAll({
			include: [{ model: models.Profesor }]
		}).then(
                function(cuestionarios) {
    res.render('cuestionarios/index.ejs', {cuestionarios: cuestionarios});
});
}

// GET /cuestionarios/:id/edit
exports.edit = function(req, res) {
    var cuestionario = req.cuestionario; //autoload de instancia de cuestionario
    res.render('cuestionarios/edit', {cuestionario: cuestionario});
};

exports.update = function(req, res) {
    req.cuestionario.observaciones = req.body.cuestionario.observaciones;
    req.cuestionario.fechaFin = req.body.cuestionario.fechaFin;
    
    req.cuestionario
            .validate()
            .then(
            function(err){
                if(err){
                    res.render('cuestionarios/edit',{cuestionario: req.cuestionario});
                }else{
                    req.cuestionario
                            .save({fields:["observaciones","fechaFin"]})
                            .then(function(){res.redirect('/admin/cuestionarios');});
                }
            }
        );
};

//Borrar cuestionarios
exports.destroy = function(req, res){
	req.cuestionario.destroy().then(function(){
        res.redirect('/admin/cuestionarios');
    }).catch(function(error){next(error)});
}
// GET /cuestionarios/new
exports.new = function(req, res) {
	var cuestionario = models.Cuestionario.build( //crea objeto cuestionario
	{creador: "Creador", observaciones: "Observaciones", fechaFin: "Fecha de Finalizacion"}
	);
    res.render('cuestionarios/new', {cuestionario: cuestionario});
};

// POST /cuestionario/create
exports.create = function(req, res) {
	var cuestionario = models.Cuestionario.build( req.body.cuestionario );
	cuestionario.set('creador',req.session.profesor.id);
	cuestionario.validate()
	.then(
		function(err){
			if(err) {
			res.render('cuestionarios/new', {cuestionario: cuestionario, errors: err.errors});
			} else {
				for(prop in cuestionario.dataValues) {console.log(prop + ' - ' + cuestionario[prop])};
				cuestionario.save({fields: ["fechaFin", "observaciones", "creador"]}).then(function(){
					res.redirect('/admin/cuestionarios');
				})	//Redireccion HTTP (URL relativo) lista de cuestionarios
			}
		}
	);
};

//listar preguntas asignadas al cuestionario
exports.cogerTodos = function(req, res, next) {
	models.Cuestionario.findAll().then(
		function(quizes){
			req.quizes = quizes;
			next();
		}
	).catch(function(error){next(error);})
};

//Muestra las preguntas de un cuestionario
exports.preguntas = function(req, res, next) {
	models.Quiz.findAll({
		where : {
			CuestionarioId : Number(req.cuestionario.id)		
		}
	}).then(
		function(quizes){
			res.render('cuestionarios/preguntas.ejs', {quizes: quizes});
		}
	).catch(function(error){next(error);})
};

//listar grupos asignados al cuestionario
exports.cogerGrupos = function(req, res, next) {
	models.Cuestionario.findAll().then(
		function(grupos){
			req.grupos = grupos;
			next();
		}
	).catch(function(error){next(error);})
};

//Muestra los grupos de un cuestionario
exports.grupos = function(req, res, next) {
	models.Grupo.findAll({
		where : {
			CuestionarioId : Number(req.cuestionario.id)		
		}
	}).then(
		function(grupos){
			res.render('cuestionarios/grupos.ejs', {grupos: grupos});
		}
	).catch(function(error){next(error);})
};

//Duplicar cuestionario
exports.duplicar = function(req, res, next) {
        var nuevo = models.Cuestionario.build();
	nuevo.set('creador',req.session.profesor.id);
        nuevo.set('observaciones',req.cuestionario.observaciones);
        nuevo.set('fechaFin',req.cuestionario.fechaFin);
	nuevo.validate()
	.then(
		function(err){
			if(err) {
			res.render('cuestionarios', {nuevo: nuevo, errors: err.errors});
			} else {
				nuevo.save({fields: ["fechaFin", "observaciones", "creador"]}).then(function(){
                            models.Quiz.findAll({
                                where : {
                                        CuestionarioId : Number(req.cuestionario.id)		
                                }
                                }).then(
                                function(quizes){
                                    for (var i = 0 ;i < quizes.length ; i++){
                                        var pregunta = models.Quiz.build();
                                        pregunta.set('CuestionarioId',nuevo.id);
                                        pregunta.set('pregunta',quizes[i].pregunta);
                                        pregunta.set('respuesta',quizes[i].respuesta);
                                        pregunta.validate();
                                        pregunta.save({fields: ["pregunta", "respuesta", "CuestionarioId"]}).then(function(){
                                            res.redirect('/admin/cuestionarios');
                                        }).catch(function(error){next(error);})
                                    }
                                }).catch(function(error){next(error);})
                        }).catch(function(error){next(error);})
		}
            }).catch(function(error){next(error);})
};
