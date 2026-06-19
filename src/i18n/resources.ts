const resources = {
  en: {
    translation: {
      fields: {
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone',
      },
      header: {
        searchPlaceholder: 'Search...'
      },
      sidebar: {
        dashboard: 'Dashboard',
        academy: 'Academy',
        alumnos: 'Students',
        pagos: 'Payments',
        torneos: 'Tournaments',
        inscripciones: 'Registrations',
        participantes: 'Participants',
        grupos: 'Groups',
        partidos: 'Matches',
        reportes: 'Reports',
        backups: 'Backups',
        config: 'Settings',
        exit: 'Exit',
      },
      buttons: {
        createStudent: 'Create student',
        create: 'Create',
        registerPayment: 'Register payment',
        exportErrors: 'Export errors'
      },
      pagos: {
        title: 'Payments',
        studentLabel: 'Student',
        amountLabel: 'Amount (ARS)',
        latestPayments: 'Latest payments',
        studentUnknown: 'Unknown student'
      },
      torneos: {
        title: 'Tournaments',
        nameLabel: 'Name',
        startLabel: 'Start',
        endLabel: 'End',
        existingTournaments: 'Existing tournaments'
      },
      alumnos: {
        title: 'Students'
      },
      import: {
        error: {
          missingFields: 'Row must contain at least firstName, email or phone',
          invalidType: 'The field {{field}} has an invalid type.',
          invalidEmail: 'The field {{field}} must be a valid email.',
          invalidValue: 'The field {{field}} has an invalid value.',
          tooSmall: 'The field {{field}} does not meet minimum length.',
          tooBig: 'The field {{field}} exceeds maximum length.',
        },
      },
      inscriptions: {
        errorsTitle: 'Errors ({{count}})',
        exportButton: 'Export errors',
        record: 'Record:',
      },
    },
  },
  es: {
    translation: {
      fields: {
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Email',
        phone: 'Teléfono',
      },
      header: {
        searchPlaceholder: 'Buscar...'
      },
      sidebar: {
        dashboard: 'Inicio',
        academy: 'Academia',
        alumnos: 'Alumnos',
        pagos: 'Pagos',
        torneos: 'Torneos',
        inscripciones: 'Inscripciones',
        participantes: 'Participantes',
        grupos: 'Grupos',
        partidos: 'Partidos',
        reportes: 'Reportes',
        backups: 'Backups',
        config: 'Configuración',
        exit: 'Salir',
      },
      buttons: {
        createStudent: 'Crear alumno',
        create: 'Crear',
        registerPayment: 'Registrar pago',
        exportErrors: 'Exportar errores'
      },
      pagos: {
        title: 'Pagos',
        studentLabel: 'Alumno',
        amountLabel: 'Monto (ARS)',
        latestPayments: 'Últimos pagos',
        studentUnknown: 'Alumno desconocido'
      },
      torneos: {
        title: 'Torneos',
        nameLabel: 'Nombre',
        startLabel: 'Inicio',
        endLabel: 'Fin',
        existingTournaments: 'Torneos existentes'
      },
      alumnos: {
        title: 'Alumnos'
      },
      import: {
        error: {
          missingFields: 'El registro debe contener al menos Nombre, Email o Teléfono.',
          invalidType: 'El campo {{field}} tiene un tipo inválido.',
          invalidEmail: 'El campo {{field}} debe ser un correo electrónico válido.',
          invalidValue: 'El campo {{field}} tiene un valor inválido.',
          tooSmall: 'El campo {{field}} no cumple la longitud mínima.',
          tooBig: 'El campo {{field}} excede la longitud máxima.',
        },
      },
      inscriptions: {
        errorsTitle: 'Errores ({{count}})',
        exportButton: 'Exportar errores',
        record: 'Registro:',
        title: 'Inscripciones (Importar CSV)',
        selectTournamentAlert: 'Seleccione un torneo',
        uploadCsvAlert: 'Cargue un CSV',
        importing: 'Importando...',
        import: 'Importar',
        resultTitle: 'Resultado de importación',
        importedCount: 'Importadas: {{count}}',
        importError: 'Error durante la importación',
        mappingTitle: 'Mapeo de columnas',
        previewTitle: 'Vista previa',
        selectPlaceholder: 'Seleccionar',
      },
    },
  },
}

export default resources
