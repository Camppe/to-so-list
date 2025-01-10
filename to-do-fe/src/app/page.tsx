"use client";

import { useEffect, useState } from "react";
import { Button, Card, Modal, Form, Input, Select, message, Tag } from "antd";

const { TextArea } = Input;

type CardType = {
  id: number;
  name: string;
  status: "to-do" | "on progress" | "done";
  description: string;
};

export default function Home() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");

  const openAddModal = () => {
    setCurrentCard(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (card: CardType) => {
    setCurrentCard(card);
    form.setFieldsValue(card);
    setIsModalOpen(true);
  };

  const openDeleteModal = (card: CardType) => {
    setCurrentCard(card);
    setIsDeleteModalOpen(true);
  };

  const handleAddEdit = () => {
    form.validateFields().then((values) => {
      if (currentCard) {
        setCards((prev) =>
          prev.map((card) => (card.id === currentCard.id ? { ...card, ...values } : card))
        );
        message.success("Card updated successfully!");
      } else {
        setCards((prev) => [
          ...prev,
          { ...values, id: Date.now() },
        ]);
        message.success("Card added successfully!");
      }
      setIsModalOpen(false);
    });
  };

  const handleDelete = () => {
    if (currentCard) {
      setCards((prev) => prev.filter((card) => card.id !== currentCard.id));
      message.success("Card deleted successfully!");
    }
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    console.log("Cards updated:", cards);
  }, [cards]);

  const filteredCards = cards.filter(
    (card) =>
      card.id.toString().includes(searchQuery) ||
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusTag = (status: string) => {
    const colorMap: { [key: string]: string } = {
      "to-do": "blue",
      "on progress": "orange",
      "done": "green",
    };
    return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6  shadow-md mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <h1 className="text-3xl font-bold">To-Do List</h1>
        </div>
      </div>
      <div className="px-12 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Input.Search
            placeholder="Search by ID, name, or description"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            allowClear
            className="w-full md:w-1/2"
          />
          <Button type="primary" onClick={openAddModal} size="large">
            Add Card
          </Button>
      </div>
      </div>

      <div className="px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
            title={
              <div className="flex justify-between items-center">
                <span className="font-semibold">{card.name}</span>
                {getStatusTag(card.status)}
              </div>
            }
            extra={
              <div>
                <Button type="link" onClick={() => openEditModal(card)}>
                  Edit
                </Button>
                <Button type="link" danger onClick={() => openDeleteModal(card)}>
                  Delete
                </Button>
              </div>
            }
          >
            <p className="text-gray-700">
              <strong>ID:</strong> {card.id}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {card.description}
            </p>
          </Card>
        ))}

        {filteredCards.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">
            No cards found matching your search.
          </p>
        )}
      </div>

      <Modal
        title={currentCard ? "Edit Card" : "Add Card"}
        open={isModalOpen}
        onOk={handleAddEdit}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        className="rounded-lg"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter a name" },
              { pattern: /^[a-zA-Z0-9\s]+$/, message: "Only text, numbers, and spaces are allowed" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Select.Option value="to-do">To-Do</Select.Option>
              <Select.Option value="on progress">On Progress</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter a description" },
              { pattern: /^[a-zA-Z0-9\s]+$/, message: "Only text, numbers, and spaces are allowed" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        className="rounded-lg"
      >
        <p>Are you sure you want to delete this card?</p>
      </Modal>
    </div>
  );
}
