use std::fmt::Display;

use validator::{ValidationErrors, ValidationErrorsKind};

pub struct ValidationError(ValidationErrors);

impl Display for ValidationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let errors = self.0.clone().into_errors();
        let errors = errors.iter().map(|(_, v)| v);
        write!(
            f,
            "{}",
            errors
                .map(|e| match e {
                    ValidationErrorsKind::Field(e) => {
                        let s = e
                            .iter()
                            .map(|e| {
                                e.message
                                    .clone()
                                    .map(|e| e.into_owned())
                                    .unwrap_or_else(|| "".to_string())
                            })
                            .collect::<Vec<String>>()
                            .join(", ");
                        s
                    }
                    ValidationErrorsKind::Struct(e) =>
                        format!("{}", ValidationError::from(*e.clone())),
                    _ => "".to_string(),
                })
                .collect::<Vec<String>>()
                .join(", ")
        )
    }
}

impl From<ValidationErrors> for ValidationError {
    fn from(errors: ValidationErrors) -> Self {
        Self(errors)
    }
}
