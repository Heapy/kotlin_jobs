import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom";
import {ErrorMessage, ErrorMessageProps, Field, FormikBag, FormikProps, withFormik} from "formik";
import {getBundleForLocale} from "./i18n/fluent";
import "bulma/css/bulma.min.css"

declare var _BUILD_TIME: string;

console.log("Build:", new Date(_BUILD_TIME).toLocaleString());

const i18n = getBundleForLocale("en");

const initialValues: KotlinJobsFormValues = {
  positionAgreement: false,
  frequencyAgreement: false,
  title: "",
  company: "",
  location: "",
  occupation: "Full-time",
  type: "Office",
  salary: "",
  contact: "",
  description: ""
};

// TypeScript FTW!!!
type FormErrors = Partial<{ -readonly [key in keyof KotlinJobsFormValues]: string }>;

function validate(values: KotlinJobsFormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.positionAgreement) errors.positionAgreement = i18n("Position-agreement-unchecked");
  if (!values.frequencyAgreement) errors.frequencyAgreement = i18n("Frequency-agreement-unchecked");
  if (!values.title) errors.title = i18n("Title-is-required");
  if (!values.location) errors.location = i18n("Location-is-required");
  if (!values.company) errors.company = i18n("Company-is-required");
  if (!values.salary) errors.salary = i18n("Salary-is-required");
  if (!values.contact) errors.contact = i18n("Contact-is-required");
  if (!values.description) errors.description = i18n("Description-is-required");
  if (values.description && values.description.length > 1000) {
    errors.description = i18n("Description-max-length", {"length": values.description.length});
  }
  return errors;
}

function onSubmit(
  values: KotlinJobsFormValues,
  formikBag: FormikBag<BuildFormProps, KotlinJobsFormValues>
): void {
  formikBag.props.callback(`Vacancy: ${values.title}
Location: ${values.location}
Company: ${values.company}
Workplace: ${values.type}
Employment: ${values.occupation}
Salary fork: ${values.salary}

${values.description}

Contact: @${values.contact}
`);
  formikBag.setSubmitting(false);
  scrollToRendered();
}

function scrollToRendered() {
  if (!window.scroll) return;

  window.scroll({
    top: window.outerHeight,
    behavior: "smooth"
  });
}

const BuildForm = withFormik<BuildFormProps, KotlinJobsFormValues>({
  mapPropsToValues: () => (initialValues),
  validate: validate,
  handleSubmit: (values, actions) => onSubmit(values, actions),
  displayName: "KotlinJobsBuildForm",
})(BuildFormFields);

function BuildFormFields(props: FormikProps<KotlinJobsFormValues>) {
  const {
    handleSubmit,
    isSubmitting,
    isValid,
    dirty
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Vacancy *</label>
        <div className="control">
          <Field component="input" className="input" type="text" name="title" placeholder="Senior Backend Engineer"/>
          <ErrorHelper name="title"/>
        </div>
      </div>

      <div className="field">
        <label className="label">Location *</label>
        <div className="control">
          <Field className="input" type="text" name="location" placeholder="Ukraine, Kyiv"/>
          <ErrorHelper name="location"/>
        </div>
      </div>

      <div className="field">
        <label className="label">Company *</label>
        <div className="control">
          <Field className="input" type="text" name="company" placeholder="JetBrains (https://jetbrains.com)"/>
          <ErrorHelper name="company"/>
        </div>
      </div>

      <div className="field">
        <label className="label">Workplace</label>
        <div className="control">
          <div className="select">
            <Field component="select" name="type">
              <option value="Office">Office</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Flexible">Flexible</option>
              <option value="Remote">Remote</option>
            </Field>
          </div>
          <ErrorHelper name="type"/>
        </div>
      </div>

      <div className="field">
        <label className="label">Employment</label>
        <div className="control">
          <div className="select">
            <Field component="select" name="occupation">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </Field>
          </div>
          <ErrorHelper name="occupation"/>
        </div>
      </div>

      <div className="field">
        <label className="label">Salary fork *</label>
        <div className="control">
          <Field className="input" type="text" name="salary" placeholder="2000$-3000$"/>
          <ErrorHelper name="salary"/>
        </div>
      </div>

      <div className="field">
        <label className="label">Nickname in Telegram *</label>
        <div className="field-body">
          <div className="field has-addons">
            <p className="control">
              <a className="button is-static">
                @
              </a>
            </p>
            <p className="control">
              <Field className="input" type="text" name="contact" placeholder="Kotliner"/>
              <ErrorHelper name="contact"/>
            </p>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Description *</label>
        <div className="control">
          <Field component="textarea" name="description" className="textarea" placeholder="Keep it short and informative. Max 1000 symbols."/>
          <ErrorHelper name="description"/>
        </div>
      </div>

      <div className="field">
        <label className="checkbox">
          <Field component="input" type="checkbox" name="positionAgreement" autoFocus/>
          <span style={{paddingLeft: 10}}>I am posting a vacancy for the position of <b>Kotlin</b> developer</span>
        </label>
        <ErrorHelper name="positionAgreement"/>
      </div>

      <div className="field">
        <label className="checkbox">
          <Field component="input" type="checkbox" name="frequencyAgreement"/>
          <span style={{paddingLeft: 10}}>I agree that the repost of the vacancy on a free basis occurs with a frequency of one month. Vacancy re-placement price within a month - 50€, payment via <a
            href="https://opencollective.com/kotlin-community">Kotlin Community Telegram OpenCollective</a>.</span>
        </label>
        <ErrorHelper name="frequencyAgreement"/>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button type="submit"
                  className="button is-primary"
                  disabled={isSubmitting || !isValid || !dirty}>
            Generate
          </button>
        </div>
      </div>
    </form>
  )
}

function ErrorHelper(props: ErrorMessageProps) {
  return (
    <ErrorMessage {...props} render={errorMessage =>
      <span className="help is-danger">{errorMessage}</span>
    }/>
  )
}

interface KotlinJobsFormValues {
  readonly positionAgreement: boolean;
  readonly frequencyAgreement: boolean;
  readonly title: string;
  readonly location: string;
  readonly company: string;
  readonly type: string;
  readonly occupation: string;
  readonly salary: string;
  readonly description: string;
  readonly contact: string;
}

interface BuildFormProps {
  readonly callback: (text: string) => void;
}

ReactDOM.render(
  <Container/>,
  document.getElementById("root")
);

function Container() {
  const [text, setText] = useState("");

  return (
    <div className="container">
      <div className="section">
        <div className="content">
          <h1>Kotlin Jobs Builder</h1>
          <div className="block">
            <div>
              <p className="notification is-warning">
                <a href="https://t.me/kotlin_jobs">@kotlin_jobs</a> временно не принимает вакансии юрлиц РФ и РБ
              </p>
            </div>

          </div>
          <p>
            Please fill in all fields of the form and
            send the generated job description to
            <a href="https://t.me/HeapyHop"> @HeapyHop</a>
          </p>
        </div>
        <div className="content">
          <BuildForm callback={setText}/>
        </div>
        <div className="content">
          {text && (
            <React.Fragment>
              <p>Copy this snippet and send it to one of the moderators</p>
              <textarea rows={30} className="textarea" contentEditable="false" value={text}/>
            </React.Fragment>
          )}
        </div>
      </div>
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            The source code is licensed under <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPLv3</a>,
            and available on <a href="https://github.com/heapy/kotlin_jobs">GitHub</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
