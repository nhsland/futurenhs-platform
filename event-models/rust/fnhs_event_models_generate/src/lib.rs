mod schema;

use inflector::Inflector;
use proc_macro2::TokenStream;
use quote::quote;
use schema::{Schema, SimpleTypes};
use std::path::PathBuf;

//fn replace_numeric_start(s: &str) -> String {
//    if s.chars().next().map(|c| c.is_numeric()).unwrap_or(false) {
//        format!("_{}", s)
//    } else {
//        s.to_string()
//    }
//}
//
//fn str_to_ident(s: &str) -> syn::Ident {
//    let s = replace_numeric_start(&s);
//    let keywords = [
//        "as", "break", "const", "continue", "crate", "else", "enum", "extern", "false", "fn",
//        "for", "if", "impl", "in", "let", "loop", "match", "mod", "move", "mut", "pub", "ref",
//        "return", "self", "static", "struct", "super", "trait", "true", "type", "unsafe", "use",
//        "where", "while", "abstract", "become", "box", "do", "final", "macro", "override", "priv",
//        "typeof", "unsized", "virtual", "yield", "async", "await", "try",
//    ];
//
//    if keywords.iter().any(|&keyword| keyword == s) {
//        syn::Ident::new(&format!("{}_", s), Span::call_site())
//    } else {
//        syn::Ident::new(&s, Span::call_site())
//    }
//}
//
//fn rename_keyword(prefix: &str, s: &str) -> Option<TokenStream> {
//    let n = str_to_ident(s);
//
//    if n != s {
//        let prefix = syn::Ident::new(prefix, Span::call_site());
//        Some(quote! {
//            #[serde(rename = #s)]
//            #prefix #n
//        })
//    } else {
//        None
//    }
//}
//
//fn field(s: &str) -> TokenStream {
//    if let Some(t) = rename_keyword("pub", s) {
//        t
//    } else {
//        let snake = s.to_snake_case();
//        if snake != s || snake.contains(|c: char| c == '$' || c == '#') {
//            let field = if snake == "ref" {
//                syn::Ident::new("ref_", Span::call_site())
//            } else {
//                syn::Ident::new(&snake.replace('$', "").replace('#', ""), Span::call_site())
//            };
//
//            quote! {
//                #[serde(rename = #s)]
//                pub #field
//            }
//        } else {
//            let field = syn::Ident::new(s, Span::call_site());
//            quote!( pub #field )
//        }
//    }
//}
//
//fn merge_option<T, F>(mut result: &mut Option<T>, r: &Option<T>, f: F)
//where
//    F: FnOnce(&mut T, &T),
//    T: Clone,
//{
//    *result = match (&mut result, r) {
//        (&mut &mut Some(ref mut result), &Some(ref r)) => return f(result, r),
//        (&mut &mut None, &Some(ref r)) => Some(r.clone()),
//        _ => return,
//    };
//}
//
//fn merge_all_of(result: &mut Schema, r: &Schema) {
//    use std::collections::btree_map::Entry;
//
//    for (k, v) in &r.properties {
//        match result.properties.entry(k.clone()) {
//            Entry::Vacant(entry) => {
//                entry.insert(v.clone());
//            }
//            Entry::Occupied(_entry) => {
//                panic!("Cannot merge two schemas with overlapping properties")
//            }
//        }
//    }
//
//    if let Some(ref ref_) = r.ref_ {
//        result.ref_ = Some(ref_.clone());
//    }
//
//    if let Some(ref description) = r.description {
//        result.description = Some(description.clone());
//    }
//
//    merge_option(&mut result.required, &r.required, |required, r_required| {
//        required.extend(r_required.iter().cloned());
//    });
//
//    result.type_ = match (result.type_.clone(), r.type_.clone()) {
//        (Some(a), Some(b)) => {
//            if a == b {
//                Some(a)
//            } else {
//                panic!("Cannot merge schemas of different type")
//            }
//        }
//        (Some(a), None) => Some(a),
//        (None, Some(b)) => Some(b),
//        (None, None) => None,
//    }
//}
//
//const LINE_LENGTH: usize = 100;
//const INDENT_LENGTH: usize = 4;
//
//fn make_doc_comment(mut comment: &str, remaining_line: usize) -> TokenStream {
//    let mut out_comment = String::new();
//    out_comment.push_str("/// ");
//    let mut length = 4;
//    while let Some(word) = comment.split(char::is_whitespace).next() {
//        if comment.is_empty() {
//            break;
//        }
//        comment = &comment[word.len()..];
//        if length + word.len() >= remaining_line {
//            out_comment.push_str("\n/// ");
//            length = 4;
//        }
//        out_comment.push_str(word);
//        length += word.len();
//        let mut n = comment.chars();
//        match n.next() {
//            Some('\n') => {
//                out_comment.push_str("\n");
//                out_comment.push_str("/// ");
//                length = 4;
//            }
//            Some(_) => {
//                out_comment.push_str(" ");
//                length += 1;
//            }
//            None => (),
//        }
//        comment = n.as_str();
//    }
//    if out_comment.ends_with(' ') {
//        out_comment.pop();
//    }
//    out_comment.push_str("\n");
//    out_comment.parse().unwrap()
//}
//
//struct FieldExpander<'a, 'r: 'a> {
//    default: bool,
//    expander: &'a mut Expander<'r>,
//}
//
//impl<'a, 'r> FieldExpander<'a, 'r> {
//    fn expand_fields(&mut self, type_name: &str, schema: &Schema) -> Vec<TokenStream> {
//        let schema = self.expander.schema(schema);
//        schema
//            .properties
//            .iter()
//            .map(|(field_name, value)| {
//                self.expander.current_field.clone_from(field_name);
//                let key = field(field_name);
//                let required = schema
//                    .required
//                    .iter()
//                    .flat_map(|a| a.iter())
//                    .any(|req| req == field_name);
//                let field_type = self.expander.expand_type(type_name, required, value);
//                if !field_type.typ.starts_with("Option<") {
//                    self.default = false;
//                }
//                let typ = field_type.typ.parse::<TokenStream>().unwrap();
//
//                let default = if field_type.default {
//                    Some(quote! { #[serde(default)] })
//                } else {
//                    None
//                };
//                let attributes = if field_type.attributes.is_empty() {
//                    None
//                } else {
//                    let attributes = field_type
//                        .attributes
//                        .iter()
//                        .map(|attr| attr.parse::<TokenStream>().unwrap());
//                    Some(quote! {
//                        #[serde( #(#attributes),* )]
//                    })
//                };
//                let comment = value
//                    .description
//                    .as_ref()
//                    .map(|comment| make_doc_comment(comment, LINE_LENGTH - INDENT_LENGTH));
//                quote! {
//                    #comment
//                    #default
//                    #attributes
//                    #key : #typ
//                }
//            })
//            .collect()
//    }
//}
//
//struct Expander<'r> {
//    root: &'r Schema,
//    current_type: String,
//    current_field: String,
//    types: Vec<(String, TokenStream)>,
//}
//
//struct FieldType {
//    typ: String,
//    attributes: Vec<String>,
//    default: bool,
//}
//
//impl<S> From<S> for FieldType
//where
//    S: Into<String>,
//{
//    fn from(s: S) -> FieldType {
//        FieldType {
//            typ: s.into(),
//            attributes: Vec::new(),
//            default: false,
//        }
//    }
//}
//
//impl<'r> Expander<'r> {
//    pub fn new(root: &'r Schema) -> Expander<'r> {
//        Expander {
//            root,
//            current_field: "".into(),
//            current_type: "".into(),
//            types: Vec::new(),
//        }
//    }
//
//    fn type_ref(&self, s: &str) -> String {
//        let s = if s == "#" {
//            panic!("No root name specified for schema")
//        } else {
//            s.split('/').last().expect("Component")
//        };
//        let s = &s.to_pascal_case();
//        replace_numeric_start(&s)
//    }
//
//    fn schema(&self, schema: &'r Schema) -> Cow<'r, Schema> {
//        let schema = match schema.ref_ {
//            Some(ref ref_) => self.schema_ref(ref_),
//            None => schema,
//        };
//        match schema.all_of {
//            Some(ref all_of) if !all_of.is_empty() => {
//                all_of
//                    .iter()
//                    .skip(1)
//                    .fold(self.schema(&all_of[0]).clone(), |mut result, def| {
//                        merge_all_of(result.to_mut(), &self.schema(def));
//                        result
//                    })
//            }
//            _ => Cow::Borrowed(schema),
//        }
//    }
//
//    fn schema_ref(&self, s: &str) -> &'r Schema {
//        s.split('/').fold(self.root, |schema, comp| {
//            if comp == "#" {
//                self.root
//            } else if comp == "definitions" {
//                schema
//            } else {
//                schema
//                    .definitions
//                    .get(comp)
//                    .unwrap_or_else(|| panic!("Expected definition: `{}` {}", s, comp))
//            }
//        })
//    }
//
//    fn expand_type(&mut self, type_name: &str, required: bool, typ: &Schema) -> FieldType {
//        let mut result = self.expand_type_(typ);
//        if type_name.to_pascal_case() == result.typ.to_pascal_case() {
//            result.typ = format!("Box<{}>", result.typ)
//        }
//        if !required && !result.default {
//            result.typ = format!("Option<{}>", result.typ)
//        }
//        result
//    }
//
//    fn expand_type_(&mut self, typ: &Schema) -> FieldType {
//        if let Some(ref ref_) = typ.ref_ {
//            self.type_ref(ref_).into()
//        } else if typ.any_of.as_ref().map_or(false, |a| a.len() == 2) {
//            let any_of = typ.any_of.as_ref().unwrap();
//            let simple = self.schema(&any_of[0]);
//            let array = self.schema(&any_of[1]);
//            if let Some(ref type_) = array.type_ {
//                if let SimpleTypes::Array = type_ {
//                    if simple == self.schema(&array.items[0]) {
//                        return FieldType {
//                            typ: format!("Vec<{}>", self.expand_type_(&any_of[0]).typ),
//                            attributes: vec![],
//                            default: true,
//                        };
//                    }
//                }
//            }
//            "serde_json::Value".into()
//        } else if let Some(ref type_) = typ.type_ {
//            match type_ {
//                SimpleTypes::String => {
//                    if typ.enum_.as_ref().map_or(false, |e| e.is_empty()) {
//                        "serde_json::Value".into()
//                    } else {
//                        "String".into()
//                    }
//                }
//                SimpleTypes::Integer => "i64".into(),
//                SimpleTypes::Boolean => "bool".into(),
//                SimpleTypes::Number => "f64".into(),
//                // Handle objects defined inline
//                SimpleTypes::Object
//                    if !typ.properties.is_empty()
//                        || typ.additional_properties == Some(Value::Bool(false)) =>
//                {
//                    let name = format!(
//                        "{}{}",
//                        self.current_type.to_pascal_case(),
//                        self.current_field.to_pascal_case()
//                    );
//                    let tokens = self.expand_schema(&name, typ);
//                    self.types.push((name.clone(), tokens));
//                    name.into()
//                }
//                SimpleTypes::Object => {
//                    let prop = match typ.additional_properties {
//                        Some(ref props) if props.is_object() => {
//                            let prop = serde_json::from_value(props.clone()).unwrap();
//                            self.expand_type_(&prop).typ
//                        }
//                        _ => "serde_json::Value".into(),
//                    };
//                    let result = format!("::std::collections::BTreeMap<String, {}>", prop);
//                    FieldType {
//                        typ: result,
//                        attributes: Vec::new(),
//                        default: typ.default == Some(Value::Object(Default::default())),
//                    }
//                }
//                SimpleTypes::Array => {
//                    let item_type = typ.items.get(0).map_or("serde_json::Value".into(), |item| {
//                        self.current_type = format!("{}Item", self.current_type);
//                        self.expand_type_(item).typ
//                    });
//                    format!("Vec<{}>", item_type).into()
//                }
//                _ => "serde_json::Value".into(),
//            }
//        } else {
//            "serde_json::Value".into()
//        }
//    }
//
//    fn expand_definitions(&mut self, schema: &Schema) {
//        for (name, def) in &schema.definitions {
//            let type_decl = self.expand_schema(name, def);
//            let definition_tokens = match def.description {
//                Some(ref comment) => {
//                    let comment_decl = make_doc_comment(comment, LINE_LENGTH);
//                    quote! {
//                        #comment_decl
//                        #type_decl
//                    }
//                }
//                None => type_decl,
//            };
//            self.types.push((name.to_string(), definition_tokens));
//        }
//    }
//
//    fn expand_schema(&mut self, original_name: &str, schema: &Schema) -> TokenStream {
//        self.expand_definitions(schema);
//
//        let pascal_case_name = &original_name.to_pascal_case();
//        self.current_type.clone_from(&pascal_case_name);
//        let (fields, default) = {
//            let mut field_expander = FieldExpander {
//                default: true,
//                expander: self,
//            };
//            let fields = field_expander.expand_fields(original_name, schema);
//            (fields, field_expander.default)
//        };
//        let name = syn::Ident::new(&pascal_case_name, Span::call_site());
//        let is_struct =
//            !fields.is_empty() || schema.additional_properties == Some(Value::Bool(false));
//        let type_decl = if is_struct {
//            if default {
//                quote! {
//                    #[derive(Clone, PartialEq, Debug, Default, Deserialize, Serialize)]
//                    pub struct #name {
//                        #(#fields),*
//                    }
//                }
//            } else {
//                quote! {
//                    #[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
//                    pub struct #name {
//                        #(#fields),*
//                    }
//                }
//            }
//        } else if schema.enum_.as_ref().map_or(false, |e| !e.is_empty()) {
//            let mut optional = false;
//            let mut repr_i64 = false;
//            let variants = if schema.enum_names.as_ref().map_or(false, |e| !e.is_empty()) {
//                let values = schema.enum_.as_ref().map_or(&[][..], |v| v);
//                let names = schema.enum_names.as_ref().map_or(&[][..], |v| v);
//                if names.len() != values.len() {
//                    panic!(
//                        "enumNames(length {}) and enum(length {}) have different length",
//                        names.len(),
//                        values.len()
//                    )
//                }
//                names
//                    .iter()
//                    .enumerate()
//                    .map(|(idx, name)| (&values[idx], name))
//                    .flat_map(|(value, name)| {
//                        let pascal_case_variant = name.to_pascal_case();
//                        let variant_name =
//                            rename_keyword("", &pascal_case_variant).unwrap_or_else(|| {
//                                let v = syn::Ident::new(&pascal_case_variant, Span::call_site());
//                                quote!(#v)
//                            });
//                        match value {
//                            Value::String(ref s) => Some(quote! {
//                                #[serde(rename = #s)]
//                                #variant_name
//                            }),
//                            Value::Number(ref n) => {
//                                repr_i64 = true;
//                                let num = syn::LitInt::new(&n.to_string(), Span::call_site());
//                                Some(quote! {
//                                    #variant_name = #num
//                                })
//                            }
//                            Value::Null => {
//                                optional = true;
//                                None
//                            }
//                            _ => panic!("Expected string,bool or number for enum got `{}`", value),
//                        }
//                    })
//                    .collect::<Vec<_>>()
//            } else {
//                schema
//                    .enum_
//                    .as_ref()
//                    .map_or(&[][..], |v| v)
//                    .iter()
//                    .flat_map(|v| match *v {
//                        Value::String(ref v) => {
//                            let pascal_case_variant = v.to_pascal_case();
//                            let variant_name = rename_keyword("", &pascal_case_variant)
//                                .unwrap_or_else(|| {
//                                    let v =
//                                        syn::Ident::new(&pascal_case_variant, Span::call_site());
//                                    quote!(#v)
//                                });
//                            Some(if pascal_case_variant == *v {
//                                variant_name
//                            } else {
//                                quote! {
//                                    #[serde(rename = #v)]
//                                    #variant_name
//                                }
//                            })
//                        }
//                        Value::Null => {
//                            optional = true;
//                            None
//                        }
//                        _ => panic!("Expected string for enum got `{}`", v),
//                    })
//                    .collect::<Vec<_>>()
//            };
//            if optional {
//                let enum_name = syn::Ident::new(&format!("{}_", name), Span::call_site());
//                if repr_i64 {
//                    quote! {
//                        pub type #name = Option<#enum_name>;
//                        #[derive(Clone, PartialEq, Debug, Serialize_repr, Deserialize_repr)]
//                        #[repr(i64)]
//                        pub enum #enum_name {
//                            #(#variants),*
//                        }
//                    }
//                } else {
//                    quote! {
//                        pub type #name = Option<#enum_name>;
//                        #[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
//                        pub enum #enum_name {
//                            #(#variants),*
//                        }
//                    }
//                }
//            } else if repr_i64 {
//                quote! {
//                    #[derive(Clone, PartialEq, Debug, Serialize_repr, Deserialize_repr)]
//                    #[repr(i64)]
//                    pub enum #name {
//                        #(#variants),*
//                    }
//                }
//            } else {
//                quote! {
//                    #[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
//                    pub enum #name {
//                        #(#variants),*
//                    }
//                }
//            }
//        } else {
//            let typ = self
//                .expand_type("", true, schema)
//                .typ
//                .parse::<TokenStream>()
//                .unwrap();
//            return quote! {
//                pub type #name = #typ;
//            };
//        };
//        if name == original_name {
//            type_decl
//        } else {
//            quote! {
//                #[serde(rename = #original_name)]
//                #type_decl
//            }
//        }
//    }
//
//    pub fn expand(mut self, schema: &Schema) -> TokenStream {
//        match schema.title {
//            Some(ref title) => {
//                let schema = self.expand_schema(&title, schema);
//                self.types.push((title.clone(), schema));
//            }
//            None => {
//                self.expand_definitions(schema);
//            }
//        }
//
//        let types = self.types.iter().map(|t| &t.1);
//
//        quote! {
//            #( #types )*
//        }
//    }
//}

struct Expander2 {
    schema: Schema,
    types: Vec<TokenStream>,
}

impl Expander2 {
    fn new(schema: Schema) -> Self {
        Self {
            schema,
            types: Vec::new(),
        }
    }

    fn expand_field(&mut self, name: &str, schema: &Schema) -> TokenStream {
        if let Some(ref ref_) = schema.ref_ {
            let parts = ref_.split('/');
            match parts {
                ("#", "definitions", def) => unimplemented!(),
                _ => panic!("only #/definitions/Item refs are supported"),
            }
        } else if let Some(ref all_of) = schema.all_of {
            unimplemented!()
        } else if let Some(ref one_of) = schema.one_of {
            unimplemented!()
        } else if let Some(ref type_) = schema.type_ {
            match type_ {
                SimpleTypes::Null => "()".parse(),
                SimpleTypes::String => "String".parse(),
                SimpleTypes::Integer => "i64".parse(),
                SimpleTypes::Boolean => "bool".parse(),
                SimpleTypes::Number => "f64".parse(),
                SimpleTypes::Object => {
                    let fields: Vec<_> = schema
                        .properties
                        .iter()
                        .map(|(key, value)| {
                            let field_name = key.to_snake_case();
                            let field_type = self
                                .expand_field(&format!("{}{}", name, key.to_pascal_case()), value);
                            quote! {
                                #[serde(rename = #key)]
                                pub #field_name: #field_type
                            }
                        })
                        .collect();
                    self.types.push(quote! {
                        #[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
                        pub struct #name {
                            #(#fields),*
                        }
                    });
                    name.parse()
                }
                SimpleTypes::Array => format!(
                    "Vec<{}>",
                    self.expand_field(
                        &format!("{}Item", name),
                        schema
                            .items
                            .as_ref()
                            .expect("arrays require an items definition")
                    )
                )
                .parse(),
            }
            .unwrap()
        } else {
            panic!("a schema needs either $ref, allOf, oneOf or a type")
        }
    }

    fn expand(mut self) -> TokenStream {
        let name = self
            .schema
            .title
            .as_ref()
            .expect("top-level title required")
            .to_pascal_case();
        self.expand_field(&name, &self.schema.clone())
    }
}

#[proc_macro]
pub fn event_models(tokens: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input_file: syn::LitStr = syn::parse_macro_input!(tokens);
    let input_file = PathBuf::from(input_file.value());
    let input_path = if input_file.is_relative() {
        let crate_root = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());
        crate_root.join(input_file)
    } else {
        input_file
    };

    let json = std::fs::read_to_string(&input_path)
        .unwrap_or_else(|err| panic!("Unable to read `{}`: {}", input_path.to_string_lossy(), err));

    let schema = serde_json::from_str(&json).unwrap_or_else(|err| panic!("{}", err));
    let expander = Expander2::new(schema);
    expander.expand().into()
}
