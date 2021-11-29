import PropTypes from 'prop-types';
import { Button, Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { isValidGuestMii } from '@/lib/constants/forms/guestMiis';
import GuestMiiForm from '@/components/mii/GuestMiiForm';
import { MII_TYPE } from '@/lib/constants/miiType';
import CmocForm from '@/components/mii/CmocForm';

function EditYourMiiCard({ miiInfo }) {
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
          }}
          validate={(values) => {
            const errors = {};

            if (
              values.miiType === MII_TYPE.CMOC &&
              values.cmocEntryNo.replaceAll('-', '').length !== 12
            ) {
              errors.cmocEntryNo =
                'Entry number must be exactly 12 characters (without dashes)';
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            const body = {
              miiType: values.miiType,
            };

            switch (values.miiType) {
              case MII_TYPE.GUEST:
                body.guestMii = values.guestMii;
                break;
              case MII_TYPE.CMOC:
                body.cmocEntryNo = values.cmocEntryNo;
                break;
              default:
                break;
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
                return;
              }
            }

            const response = await fetch('/api/account/mii', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });

            if (response.status === 200) {
              toast.success('Saved!');
            } else {
              toast.error('An error occured, please try again later.');
            }

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
                          !errors.cmocEntryNo
                            ? `/api/cmoc/${values.cmocEntryNo}`
                            : '/img/miis/guests/unknown.png'
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
