
cmake_minimum_required (VERSION 2.6)

project(zero C)

include_directories(/usr/local/include)

find_library(ZeroMQ_LIBRARY
        NAMES zmq
        PATHS /usr/local/include
        )

add_executable(server server.c)
add_executable(client client.c)

target_link_libraries(server ${ZeroMQ_LIBRARY})
target_link_libraries(client PUBLIC  ${ZeroMQ_LIBRARY})
