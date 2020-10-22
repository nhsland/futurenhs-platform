use std::fmt::{Display, Formatter, Result};
use validator::{ValidationErrors, ValidationErrorsKind};

const SEPARATOR: &str = ", ";

pub struct ValidationError(ValidationErrors);

impl Display for ValidationError {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        let s = self
            .0
            .errors()
            .values()
            .map(|e| match e {
                ValidationErrorsKind::Field(e) => e
                    .iter()
                    .map(|e| {
                        e.message
                            .clone()
                            .map(|e| e.into_owned())
                            .unwrap_or_else(|| "".to_string())
                    })
                    .collect::<Vec<String>>()
                    .join(SEPARATOR),
                ValidationErrorsKind::Struct(e) => format!("{}", ValidationError::from(*e.clone())),
                _ => "".to_string(),
            })
            .collect::<Vec<String>>()
            .join(SEPARATOR);

        write!(f, "{}", s)
    }
}

impl From<ValidationErrors> for ValidationError {
    fn from(errors: ValidationErrors) -> Self {
        Self(errors)
    }
}
