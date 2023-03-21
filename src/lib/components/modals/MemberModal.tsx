import { Button, Modal, Flex, supabase } from "@/lib";
import { Group } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  cloneElement,
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { KeyedMutator } from "swr";
import { MemberForm } from "../forms/MemberForm";
import { LordIcon } from "../LordIcon";

export type MemberFields = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  photo?: File;
};

export const MemberModal: FC<{
  mutate?: KeyedMutator<any>;
  id?: string;
  trigger?: React.ReactNode;
}> = ({ mutate, id, trigger }) => {
  const [open, handler] = useDisclosure(false);
  const [processing, setProcessing] = useState(false);

  const form = useForm<MemberFields>({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateInputOnChange: true,
    validate: {
      email: isEmail("Invalid email address"),
      password: isNotEmpty("Please enter your password"),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
      photo: isNotEmpty("Please select a photo"),
    },
  });

  const handleSave = useCallback(
    async (values: MemberFields) => {
      setProcessing(true);
      const { firstname, lastname, email, password, photo } = values;

      // save photo to supabase storage
      const { data: upload } = await supabase.storage
        .from("avatars")
        .upload(photo!.name, photo!);
      // save member to supabase table
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstname,
            lastname,
            avatar_url: upload?.path,
          },
        },
      });
      setProcessing(false);

      if (error) {
        notifications.show({
          title: "Create Member Error",
          message: error.message,
          icon: <IconX />,
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Member Created",
        message: `Member ${data?.user?.email} created successfully`,
        icon: <IconCheck />,
        color: "green",
      });
      if (mutate) mutate();

      handler.close();
    },
    [handler, mutate]
  );

  const handleSubmit = useCallback(() => {
    form.validate();
    if (form.isValid()) {
      handleSave(form.values);
    }
  }, [form, handleSave]);

  useEffect(() => {
    if (id) {
      supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            notifications.show({
              title: "Get Member Error",
              message: error.message,
              icon: <IconX />,
              color: "red",
            });
            return;
          }
          form.setValues(data);
        });
    }
  }, [id, form]);

  return (
    <>
      {trigger ? (
        cloneElement(trigger as ReactElement, { onClick: handler.open })
      ) : (
        <Button
          onClick={handler.open}
          leftIcon={
            <LordIcon
              src="/images/animated/307-avatar-icon-calm-plus-outline-edited.json"
              trigger="hover"
              target="button"
              colors={{ primary: "#fff", secondary: "#fff" }}
              size={24}
            />
          }
        >
          Add Member
        </Button>
      )}
      <Modal opened={open} onClose={handler.close} title="New Member">
        <Flex direction="column">
          <MemberForm form={form} onSubmit={form.onSubmit(handleSave)} />
          <Group position="right">
            <Button
              disabled={processing}
              onClick={handler.close}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={processing}>
              Save Member
            </Button>
          </Group>
        </Flex>
      </Modal>
    </>
  );
};
