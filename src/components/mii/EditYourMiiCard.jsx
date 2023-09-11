import PropTypes from 'prop-types';
import { Button, Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { isValidGuestMii } from '@/lib/constants/forms/guestMiis';
import GuestMiiForm from '@/components/mii/GuestMiiForm';
import { MII_TYPE } from '@/lib/constants/miiType';
import CmocForm from '@/components/mii/CmocForm';
import MiiUploadForm from '@/components/mii/MiiUploadForm';
import { isBlank } from '@/lib/utils/utils';

function EditYourMiiCard({ miiInfo }) {
  const [miiPreviewCount, setMiiPreviewCount] = useState(0);

  return (
    <Card bg="secondary" text="white" className="mb-3">
      <Card.Header as="h5">Edit your Mii</Card.Header>
      <Card.Body>
        <Formik
          initialValues={{
            miiType: miiInfo.mii_type,
            guestMii:
              isValidGuestMii(miiInfo.mii_data) === false
                ? 'unknown'
                : miiInfo.mii_data,
            cmocEntryNo:
              miiInfo.cmoc_entry_no === null ? '' : miiInfo.cmoc_entry_no,
            file: null,
          }}
          validate={(values) => {
            const errors = {};

            if (
              values.miiType === MII_TYPE.CMOC &&
              values.cmocEntryNo.replaceAll('-', '').length !== 12
            ) {
              errors.cmocEntryNo =
                'Entry Number must be exactly 12 numbers long (ignoring dashes).';
            }

            if (values.miiType === MII_TYPE.UPLOAD) {
              if (values.file === null) {
                errors.file = 'Please choose a file.';
              } else if (values.file.type !== 'image/jpeg') {
                if (
                  !isBlank(values.file.type) ||
                  !values.file.name.endsWith('.mae')
                ) {
                  errors.file = 'This file is not supported.';
                } else if (values.file.size !== 74) {
                  errors.file = 'File is too big.';
                }
              }
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            const handleJsonForm = async () => {
              const body = {
                miiType: values.miiType,
              };

              switch (values.miiType) {
                case MII_TYPE.GUEST: {
                  body.guestMii = values.guestMii;
                  break;
                }
                case MII_TYPE.CMOC: {
                  body.cmocEntryNo = values.cmocEntryNo;
                  break;
                }
                default: {
                  break;
                }
              }

              // Validate CMOC entry first
              if (values.miiType === MII_TYPE.CMOC) {
                const cmocResponse = await fetch(
                  `/api/cmoc/${values.cmocEntryNo}`
                );
                if (cmocResponse.status !== 200) {
                  setFieldError(
                    'cmocEntryNo',
                    'Mii not found in Check Mii Out Channel'
                  );
                  setSubmitting(false);
                  return null;
                }
              }

              return fetch('/api/account/mii', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
              });
            };

            const handleMultiPartForm = async () => {
              const formData = new FormData();
              formData.append('file', values.file);

              return fetch('/api/account/mii-upload', {
                method: 'POST',
                body: formData,
              });
            };

            toast.promise(
              values.miiType === MII_TYPE.UPLOAD
                ? handleMultiPartForm()
                : handleJsonForm(),
              {
                pending: 'Updating Mii...',
                success: {
                  render({ data, toastProps }) {
                    if (data.status !== 200) {
                      toastProps.type = 'error';
                      if (data.status === 413) {
                        return 'This file is too big, sorry';
                      }
                      if (
                        data.status === 400 &&
                        values.miiType === MII_TYPE.UPLOAD
                      ) {
                        return 'This does not appear to be a supported Mii';
                      }
                      return 'An error occured, please try again later';
                    }
                    setMiiPreviewCount((previous) => previous + 1);
                    return `Saved!`;
                  },
                },
                error: 'An error occured, please try again later.',
              }
            );
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Tabs
                id="mii-tabs"
                className="mb-2"
                variant="pills"
                transition={false}
                activeKey={values.miiType}
                onSelect={(k) => setFieldValue('miiType', k)}
              >
                <Tab title="Guest Mii" eventKey={MII_TYPE.GUEST}>
                  <GuestMiiForm
                    handleChange={handleChange}
                    value={values.guestMii}
                  />
                </Tab>
                <Tab title="Check Mii Out Channel" eventKey={MII_TYPE.CMOC}>
                  <Row className="text-center mb-2">
                    <Col>
                      <img
                        alt="Mii Preview"
                        src={
                          errors.cmocEntryNo
                            ? '/img/miis/guests/unknown.png'
                            : `/api/cmoc/${values.cmocEntryNo}`
                        }
                        width={128}
                        height={128}
                      />
                    </Col>
                  </Row>

                  <CmocForm
                    error={errors.cmocEntryNo}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    touched={touched}
                    value={values.cmocEntryNo}
                  />
                </Tab>
                <Tab title="Upload" eventKey={MII_TYPE.UPLOAD}>
                  <Row className="text-center mb-2">
                    <Col>
                      <img
                        alt="Mii Preview"
                        src={`api/account/uploaded-mii?${miiPreviewCount}`}
                        width={128}
                        height={128}
                      />
                    </Col>
                  </Row>

                  <MiiUploadForm
                    error={errors.file}
                    setFieldValue={setFieldValue}
                  />
                </Tab>
              </Tabs>
              <hr />
              <div className="d-flex justify-content-center">
                <Button
                  className="px-5"
                  variant="success"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
}

EditYourMiiCard.propTypes = {
  miiInfo: PropTypes.object.isRequired,
};

export default EditYourMiiCard;
